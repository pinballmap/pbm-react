import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    AsyncStorage,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'
import { Button } from 'react-native-elements'
import { retrieveItem } from '../config/utils'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import MapView from 'react-native-maps'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import {
    ActivityIndicator,
    AppAlert,
    CustomMapMarker,
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
    clearSearchBarText,
    getLocationsConsideringZoom,
    getRegions,
    fetchLocationTypes,
    fetchMachines,
    fetchOperators,
    login,
    setUnitPreference,
    getLocationAndMachineCounts,
} from '../actions'
import {
    getMapLocations
} from '../selectors'
import androidCustomDark from '../utils/androidCustomDark'
import { ThemeContext } from '../theme-context'
import Constants from 'expo-constants'
import { SafeAreaView } from 'react-native-safe-area-context'

class Map extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showNoLocationTrackingModal: false,
            maxedOutZoom: false,
            showUpdateSearch: false,
            latitude: null,
            longitude: null,
            latitudeDelta: null,
            longitudeDelta: null,
        }
    }

    static navigationOptions = () => ({
        headerBackButton: () => null,
        headerShown: false,
    })

    static contextType = ThemeContext;

    onRegionChange = (region, { isGesture }) => {
        if (isGesture) {
            this.setState({
                ...region,
                showUpdateSearch: true,
            })
        }
    }

    updateCurrentLocation = () => {
        this.props.getCurrentLocation()
        this.setState({ moveToCurrentLocation: true })
    }

    async componentDidMount() {
        await Promise.all([
            this.props.getRegions('/regions.json'),
            this.props.getLocationTypes('/location_types.json'),
            this.props.getMachines('/machines.json'),
            this.props.getOperators('/operators.json'),
            this.props.getLocationAndMachineCounts('/regions/location_and_machine_counts.json')
        ])

        if (this.props.navigation.dangerouslyGetParent().getParam('setMapLocation')) {
            this.props.navigation.dangerouslyGetParent().setParams({setMapLocation: null})
        } else {
            this.setState({ isInitialLoad: true })
            this.props.getCurrentLocation()
        }

        retrieveItem('auth').then(auth => {
            if (!auth) { this.props.navigation.navigate('SignupLogin') }
            else {
                if (auth.id) {
                    this.props.login(auth)
                    this.props.getFavoriteLocations(auth.id)
                }
                //this.navigateToScreen(initialUrl, true)
            }
        })

        retrieveItem('unitPreference').then(unitPreference => {
            if (unitPreference) {
                this.props.setUnitPreference(true)
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
            moveToCurrentLocation,
        } = this.state

        if (!this.state.latitude || moveToCurrentLocation || this.props.query.curLat !== curLat) {
            this.setState({
                latitude: curLat,
                longitude: curLon,
                latitudeDelta: latDelta,
                longitudeDelta: lonDelta,
                moveToCurrentLocation: false,
            })
        }

        if (machineId !== this.props.query.machineId || locationType !== this.props.query.locationType || numMachines !== this.props.query.numMachines || selectedOperator !== this.props.query.selectedOperator || viewByFavoriteLocations !== this.props.query.viewByFavoriteLocations || filterByMachineVersion !== this.props.query.filterByMachineVersion) {
            this.props.getLocationsConsideringZoom(latitude, longitude, latitudeDelta, longitudeDelta)
        }

        if (!props.user.locationTrackingServicesEnabled && !props.user.isFetchingLocationTrackingEnabled && props.user.isFetchingLocationTrackingEnabled !== this.props.user.isFetchingLocationTrackingEnabled) {
            if (this.state.isInitialLoad) {
                this.setState({ isInitialLoad: false })
            } else {
                this.setState({ showNoLocationTrackingModal: true })
            }
        }

    }

    render() {
        const {
            isFetchingLocations,
            mapLocations,
            navigation,
        } = this.props

        const {
            showNoLocationTrackingModal,
            showUpdateSearch,
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
        } = this.state

        const { theme } = this.context
        const s = getStyles(theme)

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
                <AppAlert />
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
                        {mapLocations.map(l => <CustomMapMarker key={l.id} marker={l} navigation={navigation} s={s} />)}
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
                    <Pressable
                        style={({ pressed }) => [{},s.containerStyle,s.myLocationContainer,pressed ? s.pressed : s.notPressed]}
                        onPress={this.updateCurrentLocation}
                    >
                        {Platform.OS === 'ios' ?
                            <FontAwesome
                                name={'location-arrow'}
                                color={theme.text2}
                                size={24}
                                style={{justifyContent:'center',alignSelf:'center'}}
                            /> :
                            <MaterialIcons
                                name={'gps-fixed'}
                                color={theme.text2}
                                size={24}
                                style={{justifyContent:'center',alignSelf:'center'}}
                            />
                        }
                    </Pressable>
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
        backgroundColor: theme.base1
    },
    confirmText: {
        textAlign: 'center',
        fontSize: 16,
        marginLeft: 10,
        marginRight: 10
    },
    buttonContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        marginBottom: 10
    },
    buttonStyle: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 10,
        paddingRight: 10,
        height: 30,
        borderRadius: 25,
        backgroundColor: theme.base1,
    },
    buttonTitle: {
        color: theme.text,
        fontSize: 14
    },
    containerStyle: {
        shadowColor: theme.darkShadow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: .6,
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
        backgroundColor: theme.base1,
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
    myLocationContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        alignSelf: 'center',
        justifyContent:'center',
        borderRadius: 25,
        height: 50,
        width: 50,
        backgroundColor: theme.base1,
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
    motd: PropTypes.string,
    getLocationsConsideringZoom: PropTypes.func,
    clearSearchBarText: PropTypes.func,
}

const mapStateToProps = (state) => {
    const { error, locations, query, user } = state
    const mapLocations = getMapLocations(state)

    return {
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
    clearSearchBarText: () => dispatch(clearSearchBarText()),
    getRegions: (url) => dispatch(getRegions(url)),
    getLocationTypes: (url) => dispatch(fetchLocationTypes(url)),
    getMachines: (url) =>  dispatch(fetchMachines(url)),
    getOperators: (url) => dispatch(fetchOperators(url)),
    login: (auth) => dispatch(login(auth)),
    setUnitPreference: (preference) => dispatch(setUnitPreference(preference)),
    getLocationAndMachineCounts: (url) => dispatch(getLocationAndMachineCounts(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)
