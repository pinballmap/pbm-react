import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    AsyncStorage,
    Image,
    Platform,
    StyleSheet,
    View,
} from 'react-native'
import {
    Button,
    ButtonGroup,
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
} from '../components'
import {
    fetchCurrentLocation,
    getFavoriteLocations,
    clearFilters,
    clearError,
    getLocationsConsideringZoom,
    updateMapCoordinates,
} from '../actions'
import {
    getMapLocations
} from '../selectors'
import androidCustomDark from '../utils/androidCustomDark'
import { ThemeContext } from '../theme-context'

const MenuIcon = (props) => {
    const { numMachines } = props
    let dotFontMargin, dotWidthHeight
    if (numMachines < 10) {
        dotFontMargin = Platform.OS === 'ios' ? 0 : -2
        dotWidthHeight = 32
    } else if (numMachines < 20) {
        dotFontMargin = Platform.OS === 'ios' ? 2 : 0
        dotWidthHeight = 36
    } else if (numMachines < 100) {
        dotFontMargin = Platform.OS === 'ios' ? 4 : 2
        dotWidthHeight = 40
    } else {
        dotFontMargin = Platform.OS === 'ios' ? 7 : 4
        dotWidthHeight = 46
    }
    return (
        <View style={{
            width: dotWidthHeight,
            height: dotWidthHeight,
            borderRadius: dotWidthHeight / 2,
            borderWidth: 3,
            borderColor: '#d2e5fa',
            backgroundColor: '#78b6fb',
            elevation: 1,
        }}>
            <Text style={{
                color: 'white',
                fontWeight:'bold',
                textAlign:'center',
                fontSize: 20,
                marginTop:dotFontMargin}}>
                {numMachines}
            </Text>
        </View>
    )
}

MenuIcon.propTypes = {
    numMachines: PropTypes.number,
}

const component1 = () => <MaterialCommunityIcons name="format-list-bulleted" size={24} underlayColor='transparent' />
const component2 = () => <MaterialCommunityIcons name="filter-outline" size={24} underlayColor='transparent' />

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
            {marker.icon === 'dot' ? <MenuIcon numMachines={marker.machine_names.length} /> : <Image source={markerDotHeart} style={{ height: 28, width: 32 }} onLoad={stopRendering} />}
            <MapView.Callout onPress={() => navigation.navigate('LocationDetails', { id: marker.id, locationName: marker.name })}>
                <View>
                    <View style={s.calloutStyle}>
                        <Text style={{ marginRight: 20, color: '#000e18', fontWeight: 'bold' }}>{marker.name}</Text>
                        <Text style={{ marginRight: 20, color: '#000e18', marginTop: 5 }}>{`${marker.street}, ${marker.city}, ${marker.state} ${marker.zip}`}</Text>
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

        this.mapRef = null
        this.prevRegion = {}

        this.state = {
            showNoLocationTrackingModal: false,
            maxedOutZoom: false,
            themeState: '',
            showAppAlert: false,
            selectedIndex: 2
        }
        this.updateIndex = this.updateIndex.bind(this)
    }

    static navigationOptions = ({ navigation }) => {
        const theme = navigation.state.params && navigation.state.params.theme || ''

        const titleStyle = {
            color: theme === 'dark' ? '#addbff' : '#1e9dff',
            fontSize: 16,
            fontWeight: Platform.OS === 'ios' ? "600" : "400"
        }

        return {
            headerLeft: null,
            headerTitle:
                <Search
                    navigate={navigation.navigate}
                />,
            headerRight: null,
            headerStyle: {
                //backgroundColor: theme === 'dark' ? '#1d1c1d' : '#fff7eb',
                shadowColor: 'transparent',
                backgroundColor: 'transparent',
                elevation: 0,
                borderBottomColor: 'transparent',
                shadowOffset: { height: 0, width: 0 }
            },
        }
    }

    static contextType = ThemeContext;

    onRegionChange = (region) => {
        const compareRegion = (region) => {
            this.props.getLocationsConsideringZoom(region.latitude, region.longitude, region.latitudeDelta, region.longitudeDelta)
        }

        if (Math.abs(region.latitude - this.prevRegion.latitude) > 0.001) {
            setTimeout(compareRegion, 800, region)
            this.props.updateMapCoordinates({
                ...region
            })
        }
        this.prevRegion = region
    }

    updateCurrentLocation = () => {
        this.props.getCurrentLocation()
    }

    componentDidUpdate() {
        if (this.mapRef) {
            setTimeout(() => this.mapRef.fitToElements(true), 1000)
        }

        const { theme } = this.context.theme
        if (theme !== this.state.themeState) {
            this.updateTheme(theme)
        }
    }

    componentDidMount() {
        if(this.props.navigation.dangerouslyGetParent().getParam('setMapLocation')) {
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
        } = props.query

        if (machineId !== this.props.query.machineId || locationType !== this.props.query.locationType || numMachines !== this.props.query.numMachines || selectedOperator !== this.props.query.selectedOperator || viewByFavoriteLocations !== this.props.query.viewByFavoriteLocations) {
            this.props.getLocationsConsideringZoom(curLat, curLon, latDelta, lonDelta)
        }

    }

    updateTheme(theme) {
        this.setState({ themeState: theme })
        this.props.navigation.setParams({ theme })
    }

    updateIndex (selectedIndex) {
        selectedIndex ? this.props.navigation.navigate('FilterMap') : this.props.navigation.navigate('LocationList')
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
        } = this.state

        const { theme } = this.context
        const s = getStyles(theme)

        const buttons = [{ element: component1 }, { element: component2 }]
        const { selectedIndex } = this.state

        const { locationTrackingServicesEnabled } = this.props.user
        const { errorText = false } = this.props.error
        const { machineId = false, locationType = false, numMachines = false, selectedOperator = false, viewByFavoriteLocations, curLat: latitude, curLon: longitude, latDelta: latitudeDelta, lonDelta: longitudeDelta, maxZoom } = this.props.query
        const filterApplied = machineId || locationType || numMachines || selectedOperator || viewByFavoriteLocations ? true : false

        if (!latitude) {
            return (
                <ActivityIndicator />
            )
        }

        return (
            <View style={{ flex: 1, backgroundColor: '#fff7eb' }}>
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
                {isFetchingLocations ? <Text style={s.loading}>Loading...</Text> : null}
                {maxZoom ? <Text style={s.loading}>Zoom in for updated results</Text> : null}
                <View style={{ flex: 1, position: 'absolute', left: 0, top: -100, bottom: 0, right: 0 }}>
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
                    <ButtonGroup
                        onPress={this.updateIndex}
                        selectedIndex={selectedIndex}
                        buttons={buttons}
                        containerStyle={{height: 100, width: 40, position: 'absolute', right: 0, top: 110, borderRadius: 10,}}
                        buttonStyle={{shadowColor: '#dcd3d6',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.9,shadowRadius: 5,elevation: 5,}}
//                         containerStyle={s.buttonGroupContainer}
//                         textStyle={s.buttonGroupInactive}
//                         selectedButtonStyle={s.selButtonStyle}
//                         selectedTextStyle={s.selTextStyle}
//                         innerBorderStyle={s.innerBorderStyle}
                        vertical
                    />
                    <Icon
                        onPress={() => navigation.navigate('FilterMap')}
                        containerStyle={{ position: 'absolute', top: 160, left: 0 }}
                        type='material-community'
                        name='filter-outline'
                        size={24}
                        raised
                        underlayColor='transparent'
                    />
                    <Icon
                        onPress={() => navigation.navigate('LocationList')}
                        containerStyle={{ position: 'absolute', top: 100, left: 0}}
                        type='material-community'
                        name='format-list-bulleted'
                        size={24}
                        raised
                        underlayColor='transparent'
                    />
                    <Button
                        onPress={() => navigation.navigate('FilterMap')}
                        containerStyle={{ position: 'absolute', top: 110, left: 70, borderRadius: 25 }}
                        icon={<MaterialCommunityIcons name='filter-outline' style={{fontSize: 18}} />}
                        buttonStyle={{paddingTop: 0, paddingBottom: 0, height: 25, borderRadius: 25, backgroundColor: 'white',shadowColor: '#dcd3d6',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.9,shadowRadius: 5,elevation: 5,}}
                        titleStyle={{color:'#394046',fontSize:14}}
                        title="Filter"
                        underlayColor='transparent'
                    />
                    <Button
                        onPress={() => navigation.navigate('LocationList')}
                        containerStyle={{ position: 'absolute', top: 110, left: 150, borderRadius: 25 }}
                        icon={<MaterialCommunityIcons name='format-list-bulleted' style={{fontSize: 18}} />}
                        buttonStyle={{paddingTop: 0, paddingBottom: 0, height: 25, borderRadius: 25, backgroundColor: 'white',shadowColor: '#dcd3d6',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.9,shadowRadius: 5,elevation: 5,}}
                        titleStyle={{color:'#394046',fontSize:14}}
                        title="List"
                        underlayColor='transparent'
                    />
                    <Icon
                        raised
                        name='gps-fixed'
                        underlayColor='transparent'
                        type='material'
                        color='#1e9dff'
                        containerStyle={{ position: 'absolute', bottom: 0, right: 0 }}
                        size={24}
                        onPress={() => {
                            locationTrackingServicesEnabled ? this.updateCurrentLocation() : this.setState({ showNoLocationTrackingModal: true })
                        }}
                    />
                    {filterApplied ?
                        <Button
                            title={'Clear Filter'}
                            onPress={() => this.props.clearFilters()}
                            type="clear"
                            titleStyle={s.clear}
                            containerStyle={{ width: 100, position: 'absolute', top: 0, right: 0 }}
                        />
                        : null
                    }
                </View>
            </View>
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
        maxWidth: 275,
        height: Platform.OS === 'ios' ? 60 : 70,
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
        top: Platform.OS === 'ios' ? 14 : 20,
        right: Platform.OS === 'ios' ? -5 : 2,
        zIndex: 0
    },
    loading: {
        zIndex: 10,
        alignSelf: "center",
        padding: 5,
        backgroundColor: theme.blue1,
        color: theme.text,
        fontSize: 14,
        marginTop: 5,
    },
    clear: {
        fontSize: 14,
        color: "#F53240",
        padding: 5,
        backgroundColor: theme.blue1
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
    }
})

Map.propTypes = {
    isFetchingLocations: PropTypes.bool,
    mapLocations: PropTypes.array,
    query: PropTypes.object,
    user: PropTypes.object,
    getCurrentLocation: PropTypes.func,
    updateMapCoordinates: PropTypes.func,
    navigation: PropTypes.object,
    getFavoriteLocations: PropTypes.func,
    clearFilters: PropTypes.func,
    clearError: PropTypes.func,
    error: PropTypes.object,
    appAlert: PropTypes.string,
    getLocationsConsideringZoom: PropTypes.func,
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
    updateMapCoordinates: ({...region}) => dispatch(updateMapCoordinates({...region})),
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)
