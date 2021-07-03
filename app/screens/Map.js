import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    AsyncStorage,
    Dimensions,
    Image,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'
import {
    Button,
    Icon,
} from 'react-native-elements'
import { retrieveItem } from '../config/utils'
import { Ionicons } from '@expo/vector-icons'
import MapView from 'react-native-maps'
import markerDotHeart from '../assets/images/markerdot-heart.png'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import {
    ActivityIndicator,
    PbmButton,
    ConfirmationModal,
    Search,
    Text,
    IosMarker,
} from '../components'
import {
    fetchCurrentLocation,
    getFavoriteLocations,
    clearFilters,
    clearError,
    clearSearchBarText,
    getLocationsConsideringZoom,
} from '../actions'
import {
    getMapLocations
} from '../selectors'
import androidCustomDark from '../utils/androidCustomDark'
import { ThemeContext } from '../theme-context'
import Constants from 'expo-constants'
import { SafeAreaView } from 'react-native-safe-area-context'

let deviceWidth = Dimensions.get('window').width

const MarkerDot = ({numMachines}) => Platform.OS === 'ios' ? <IosMarker numMachines={numMachines}/> : null

MarkerDot.propTypes = {
    numMachines: PropTypes.number,
}

const CustomMarker = ({ marker, navigation, s }) => {
    const [tracksViewChanges, setTracksViewChanges] = useState(true)

    const stopRendering = () => setTracksViewChanges(false)
    return (
        <MapView.Marker
            key={marker.id}
            coordinate={{
                latitude: Number(marker.lat),
                longitude: Number(marker.lon)
            }}
            title={marker.title}
            tracksViewChanges={tracksViewChanges}
            pointerEvents="auto"
        >
            {marker.icon === 'dot' ? <MarkerDot numMachines={marker.machine_names.length} /> : <Image source={markerDotHeart} style={{ height: 28, width: 32 }} onLoad={stopRendering} />}
            <MapView.Callout onPress={() => navigation.navigate('LocationDetails', { id: marker.id, locationName: marker.name })}>
                <View>
                    <View style={s.calloutStyle}>
                        <Text style={{ marginRight: 20, color: '#000e18', fontWeight: 'bold' }}>{marker.name}</Text>
                        <Text style={{ marginRight: 20, color: '#000e18', marginTop: 5 }}>{`${marker.street}, ${marker.city}, ${marker.state} ${marker.zip}`}</Text>
                        {Platform.OS === 'android' ?
                            <Text style={{ color: '#000e18', marginTop: 5 }}>{`${marker.machine_names.length} machine${marker.machine_names.length >1 ? 's': ''}`}</Text>
                            : null
                        }
                    </View>
                    <Ionicons style={s.iconStyle} name="ios-arrow-forward-circle-outline" />
                </View>
            </MapView.Callout>
        </MapView.Marker>
    )
}

CustomMarker.propTypes = {
    marker: PropTypes.object,
    navigation: PropTypes.object,
    s: PropTypes.object,
}

class Map extends Component {
    constructor(props) {
        super(props)

        this.prevRegion = {}

        this.state = {
            showNoLocationTrackingModal: false,
            maxedOutZoom: false,
            themeState: '',
            showAppAlert: false,
            showUpdateSearch: false,
            latitude: null,
            longitude: null,
            latitudeDelta: null,
            longitudeDelta: null,
            mapCoordinatesUpdated: false,
        }
    }

    static navigationOptions = () => ({
        headerBackButton: () => null,
        headerShown: false,
    })

    static contextType = ThemeContext;

    onRegionChange = (region, { isGesture }) => {
        if (Math.abs(region.latitude - this.prevRegion.latitude) > 0.001 && isGesture) {
            this.setState({
                ...region,
                showUpdateSearch: this.state.mapCoordinatesUpdated ? false : true,
                mapCoordinatesUpdated: false
            })
        }
        this.prevRegion = region
    }

    updateCurrentLocation = () => {
        this.props.getCurrentLocation()
    }

    componentDidUpdate() {
        const { theme } = this.context.theme
        if (theme !== this.state.themeState) {
            this.updateTheme(theme)
        }
    }

    componentDidMount() {
        if (this.props.navigation.dangerouslyGetParent().getParam('setMapLocation')) {
            this.props.navigation.dangerouslyGetParent().setParams({setMapLocation: null})
        } else {
            this.props.getCurrentLocation()
        }

        retrieveItem('appAlert').then(appAlert => {
            if (appAlert !== this.props.appAlert) {
                this.setState({ showAppAlert: true })
                AsyncStorage.setItem('appAlert', JSON.stringify(this.props.appAlert))
            }
        })
    }

    UNSAFE_componentWillReceiveProps(props) {
        const {
            curLat,
            curLon,
            latDelta,
            lonDelta,
            machineId,
            locationType,
            numMachines,
            selectedOperator,
            viewByFavoriteLocations,
            filterByMachineVersion,
        } = props.query

        const {
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
        } = this.state

        if (!this.state.latitude || this.props.query.curLat !== curLat) {
            this.setState({
                latitude: curLat,
                longitude: curLon,
                latitudeDelta: latDelta,
                longitudeDelta: lonDelta,
                mapCoordinatesUpdated: true,
            })
        }

        if (machineId !== this.props.query.machineId || locationType !== this.props.query.locationType || numMachines !== this.props.query.numMachines || selectedOperator !== this.props.query.selectedOperator || viewByFavoriteLocations !== this.props.query.viewByFavoriteLocations || filterByMachineVersion !== this.props.query.filterByMachineVersion) {
            this.props.getLocationsConsideringZoom(latitude, longitude, latitudeDelta, longitudeDelta)
        }

    }

    updateTheme(theme) {
        this.setState({ themeState: theme })
        this.props.navigation.setParams({ theme })
    }

    render() {
        const {
            appAlert,
            isFetchingLocations,
            mapLocations,
            navigation,
        } = this.props

        const {
            showNoLocationTrackingModal,
            showAppAlert,
            showUpdateSearch,
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
        } = this.state

        const { theme } = this.context
        const s = getStyles(theme)

        const { locationTrackingServicesEnabled } = this.props.user
        const { errorText = false } = this.props.error
        const { machineId = false, locationType = false, numMachines = false, selectedOperator = false, viewByFavoriteLocations, maxZoom } = this.props.query
        const filterApplied = machineId || locationType || numMachines || selectedOperator || viewByFavoriteLocations ? true : false

        if (!latitude) {
            return (
                <ActivityIndicator />
            )
        }

        return (
            <>
                <ConfirmationModal
                    visible={showAppAlert}>
                    <View style={s.appAlertHeader}>
                        <Text style={s.appAlertTitle}>Message of the Day!</Text>
                        <MaterialCommunityIcons
                            name='close-circle'
                            size={45}
                            onPress={() => this.setState({ showAppAlert: false })}
                            style={s.xButton}
                        />
                    </View>
                    <View style={s.appAlert}>
                        <Text style={{fontSize: 16}}>{appAlert}</Text>
                    </View>
                </ConfirmationModal>
                <ConfirmationModal
                    visible={showNoLocationTrackingModal}>
                    <View>
                        <Text style={s.confirmText}>Location tracking must be enabled to use this feature!</Text>
                        <PbmButton
                            title={"OK"}
                            onPress={() => this.setState({ showNoLocationTrackingModal: false })}
                            accessibilityLabel="Great!"
                            containerStyle={s.buttonContainer}
                        />
                    </View>
                </ConfirmationModal>
                <ConfirmationModal
                    visible={errorText ? true : false}>
                    <View>
                        <Text style={s.confirmText}>{errorText}</Text>
                        <PbmButton
                            title={"OK"}
                            onPress={() => this.props.clearError()}
                        />
                    </View>
                </ConfirmationModal>
                <SafeAreaView edges={['right', 'left', 'top']} style={{flex:1,marginTop: -Constants.statusBarHeight}}>
                    <View style={s.search}>
                        <Search navigate={navigation.navigate}/>
                    </View>
                    {isFetchingLocations ? <View style={s.loading}><Text style={s.loadingText}>Loading...</Text></View> : null}
                    {maxZoom ? <Text style={s.loading}>Zoom in for updated results</Text> : null}
                    <MapView
                        ref={this.mapRef}
                        region={{
                            latitude,
                            longitude,
                            latitudeDelta,
                            longitudeDelta,
                        }}
                        style={s.map}
                        onRegionChangeComplete={this.onRegionChange}
                        showsUserLocation={true}
                        moveOnMarkerPress={false}
                        showsMyLocationButton={false}
                        provider = { MapView.PROVIDER_GOOGLE }
                        customMapStyle={theme.theme === 'dark' ? androidCustomDark : []}
                    >
                        {mapLocations.map(l => <CustomMarker key={l.id} marker={l} navigation={navigation} s={s} />)}
                    </MapView>
                    <Button
                        onPress={() => navigation.navigate('LocationList')}
                        icon={<MaterialCommunityIcons name='format-list-bulleted' style={{fontSize: 18,color:theme.text,paddingRight:5}} />}
                        containerStyle={[s.listButtonContainer,s.containerStyle]}
                        buttonStyle={s.buttonStyle}
                        titleStyle={s.buttonTitle}
                        title="List"
                        underlayColor='transparent'
                    />
                    <Icon
                        reverse
                        name={Platform.OS === 'ios' ? 'location-arrow' : 'gps-fixed'}
                        underlayColor='transparent'
                        type={Platform.OS === 'ios' ? 'font-awesome' : 'material'}
                        color={theme.neutral}
                        reverseColor={theme.orange7}
                        containerStyle={[s.containerStyle,{ position: 'absolute', bottom: 5, right: 5 }]}
                        size={24}
                        onPress={() => {
                            locationTrackingServicesEnabled ? this.updateCurrentLocation() : this.setState({ showNoLocationTrackingModal: true })
                        }}
                    />
                    {filterApplied ?
                        <Button
                            title={'Clear Filter'}
                            onPress={() => this.props.clearFilters()}
                            containerStyle={[s.filterContainer,s.containerStyle]}
                            buttonStyle={[s.buttonStyle,{backgroundColor:'#fee5e7'}]}
                            titleStyle={{color:'#453e39',fontSize: 14}}
                        />
                        : null
                    }
                    {showUpdateSearch ?
                        <Pressable
                            style={({ pressed }) => [{},s.containerStyle,s.updateContainerStyle,pressed ? s.pressed : s.notPressed]}
                            onPress={() => {
                                this.setState({ showUpdateSearch: false })
                                this.props.getLocationsConsideringZoom(latitude, longitude, latitudeDelta, longitudeDelta)
                                this.props.clearSearchBarText()
                            }}
                        >
                            {({ pressed }) => (
                                <Text style={[ pressed ? s.pressedTitleStyle : s.updateTitleStyle]}>
                                    Search this area
                                </Text>
                            )}
                        </Pressable>
                        : null
                    }
                </SafeAreaView>
            </>
        )
    }
}

const getStyles = theme => StyleSheet.create({
    map: {
        flex: 1
    },
    calloutStyle: {
        minWidth: 50,
        width: '100%',
        maxWidth: deviceWidth < 325 ? deviceWidth - 50 : 275,
        height: Platform.OS === 'ios' ? 70 : 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'space-around',
        zIndex: 5,
        marginRight: 7,
    },
    iconStyle: {
        fontSize: 26,
        color: '#c1c9cf',
        position: "absolute",
        top: Platform.OS === 'ios' ? 14 : 30,
        right: Platform.OS === 'ios' ? -5 : 2,
        zIndex: 0
    },
    search: {
        position: 'absolute',
        top: Constants.statusBarHeight > 40 ? Constants.statusBarHeight + 50 : Constants.statusBarHeight + 30,
        zIndex: 10,
        alignSelf: "center"
    },
    loading: {
        zIndex: 10,
        position: 'absolute',
        top: Constants.statusBarHeight > 40 ? Constants.statusBarHeight + 100 : Constants.statusBarHeight + 80,
        alignSelf: "center",
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: theme.blue1,
        borderRadius: 15
    },
    loadingText: {
        color: theme.text,
        fontSize: 14,
    },
    clear: {
        fontSize: 16,
        color: "#F53240",
        padding: 5,
        backgroundColor: theme.neutral
    },
    confirmText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
        marginRight: 10
    },
    buttonContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        marginBottom: 10
    },
    xButton: {
        position: 'absolute',
        right: -15,
        top: -15,
        color: theme.red2,
    },
    appAlertTitle: {
        color: theme.orange8,
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold'
    },
    appAlertHeader: {
        backgroundColor: theme.blue1,
        marginTop: -15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: 40,
        paddingVertical: 10,
    },
    appAlert: {
        padding: 10,
        paddingBottom: 0,
    },
    buttonStyle: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 10,
        paddingRight: 10,
        height: 30,
        borderRadius: 25,
        backgroundColor: theme.white,
    },
    buttonTitle: {
        color: theme.text,
        fontSize: 14
    },
    containerStyle: {
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 6,
        overflow: 'visible'
    },
    listButtonContainer: {
        position: 'absolute',
        top: Constants.statusBarHeight > 40 ? Constants.statusBarHeight + 100 : Constants.statusBarHeight + 80,
        left: 15,
        borderRadius: 25,
    },
    updateContainerStyle: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        borderRadius: 25,
        backgroundColor: theme.white,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    updateTitleStyle: {
        color: theme.blue4,
        fontSize: 16
    },
    pressedTitleStyle: {
        color: theme.blue3,
        fontSize: 16
    },
    filterContainer: {
        position: 'absolute',
        top: Constants.statusBarHeight > 40 ? Constants.statusBarHeight + 100 : Constants.statusBarHeight + 80,
        right: 15,
        borderRadius: 25
    },
    pressed: {
        opacity: 0.8,
        backgroundColor: theme.blue1
    },
    notPressed: {
        opacity: 1.0
    }
})

Map.propTypes = {
    isFetchingLocations: PropTypes.bool,
    mapLocations: PropTypes.array,
    query: PropTypes.object,
    user: PropTypes.object,
    getCurrentLocation: PropTypes.func,
    navigation: PropTypes.object,
    getFavoriteLocations: PropTypes.func,
    clearFilters: PropTypes.func,
    clearError: PropTypes.func,
    error: PropTypes.object,
    appAlert: PropTypes.string,
    getLocationsConsideringZoom: PropTypes.func,
    clearSearchBarText: PropTypes.func,
}

const mapStateToProps = (state) => {
    const { error, locations, query, regions, user } = state
    const mapLocations = getMapLocations(state)
    const appAlert = regions.regions.filter(region => region.id === 1)[0].motd

    return {
        appAlert,
        error,
        query,
        user,
        mapLocations,
        isFetchingLocations: locations.isFetchingLocations,
    }
}
const mapDispatchToProps = (dispatch) => ({
    getCurrentLocation: () => dispatch(fetchCurrentLocation()),
    getFavoriteLocations: (id) => dispatch(getFavoriteLocations(id)),
    clearFilters: () => dispatch(clearFilters()),
    clearError: () => dispatch(clearError()),
    getLocationsConsideringZoom: (lat, lon, latDelta, lonDelta) => dispatch(getLocationsConsideringZoom(lat, lon, latDelta, lonDelta)),
    clearSearchBarText: () => dispatch(clearSearchBarText())
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)
