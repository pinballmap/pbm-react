import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Linking,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'
import { Button } from 'react-native-elements'
import { retrieveItem } from '../config/utils'
import { getData } from '../config/request'
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
    NoLocationTrackingModal,
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
    updateCoordinates,
    updateCoordinatesAndGetLocations,
    getLocationsByRegion,
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
            showUpdateSearch: false,
        }
    }

    static navigationOptions = () => ({
        headerBackButton: () => null,
        headerShown: false,
    })

    static contextType = ThemeContext

    navigateToScreen = async (url) => {
        const { navigate } = this.props.navigation
        if (url.indexOf('location_id=') > 0) {
            const idSegment = url.split('location_id=')[1]
            const id = idSegment.split('&')[0]
            navigate('LocationDetails', { id })
        } else if (url.indexOf('address=') > 0) {
            const decoded = decodeURIComponent(url)
            const address = decoded.split('address=')[1]
            const { location } = await getData(`/locations/closest_by_address.json?address=${address};no_details=1`)
            if (location) {
                this.props.updateCoordinatesAndGetLocations(location.lat, location.lon)
            }
            navigate('Map')
        } else if (url.indexOf('region=') > 0) {
            const regionSegment = url.split('region=')[1]
            const regionName = regionSegment.split('&')[0]
            const region = this.props.regions.regions.find(({name}) => name.toLowerCase() === regionName.toLowerCase())

            const citySegment = url.indexOf('by_city_id=') > 0 ? url.split('by_city_id=')[1] : ''
            const cityName = citySegment.split('&')[0]
            let locations = []
            if (cityName) {
                const byCity = await getData(`/region/${regionName}/locations.json?by_city_id=${cityName}`)
                locations = byCity.locations || []
                if (locations.length > 0) {
                    const {lat, lon} = locations[0]
                    this.props.updateCoordinatesAndGetLocations(lat, lon)
                }
            }
            // If something goes wrong trying to get the specific city (highly plausible as it requires exact case matching), still get locations for the region
            if (region && locations.length === 0) {
                this.props.getLocationsByRegion(region)
            }
            navigate('Map')
        } else if (url.indexOf('about') > 0) {
            navigate('Contact')
        } else if (url.indexOf('events') > 0) {
            navigate('Events')
        } else if (url.indexOf('suggest') > 0) {
            navigate('SuggestLocation')
        } else if (url.indexOf('saved') > 0) {
            navigate('Saved')
        } else {
            const region = this.props.regions.regions.find(({name}) => url.includes(name))
            if (region) {
                this.props.getLocationsByRegion(region)
            }
            navigate('Map')
        }
    }

    onRegionChange = (region, { isGesture }) => {
        if (isGesture) {
            this.setState({ showUpdateSearch: true })
            this.props.updateCoordinates(region.latitude, region.longitude, region.latitudeDelta, region.longitudeDelta)
        }
    }

    updateCurrentLocation = () => {
        this.props.getCurrentLocation()
    }

    async componentDidMount() {
        await Promise.all([
            this.props.getRegions('/regions.json'),
            this.props.getLocationTypes('/location_types.json'),
            this.props.getMachines('/machines.json'),
            this.props.getOperators('/operators.json'),
            this.props.getLocationAndMachineCounts('/regions/location_and_machine_counts.json'),
            this.props.getCurrentLocation(true)
        ])

        Linking.addEventListener('url', ({url}) => this.navigateToScreen(url))

        retrieveItem('auth').then(async auth => {
            if (!auth) { this.props.navigation.navigate('SignupLogin') }
            else {
                const initialUrl = await Linking.getInitialURL() || ''
                if (auth.id) {
                    this.props.login(auth)
                    this.props.getFavoriteLocations(auth.id)
                }
                this.navigateToScreen(initialUrl)
            }
        })

        retrieveItem('unitPreference').then(unitPreference => {
            if (unitPreference) {
                this.props.setUnitPreference(true)
            }
        })
    }

    render() {
        const {
            isFetchingLocations,
            mapLocations,
            navigation,
            query,
        } = this.props

        const { showUpdateSearch } = this.state
        const { theme } = this.context
        const s = getStyles(theme)
        const { curLat, curLon, latDelta, lonDelta } = query
        const { errorText = false } = this.props.error
        const { machineId = false, locationType = false, numMachines = false, selectedOperator = false, viewByFavoriteLocations, maxZoom } = this.props.query
        const filterApplied = machineId || locationType || numMachines || selectedOperator || viewByFavoriteLocations ? true : false

        if (!curLat) {
            return (
                <ActivityIndicator />
            )
        }

        return (
            <SafeAreaView edges={['right', 'left', 'top']} style={{flex:1,marginTop: -Constants.statusBarHeight}}>
                <AppAlert />
                <NoLocationTrackingModal />
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
                <View style={s.search}>
                    <Search navigate={navigation.navigate}/>
                </View>
                {isFetchingLocations ? <View style={s.loading}><Text style={s.loadingText}>Loading...</Text></View> : null}
                {maxZoom ? <Text style={s.loading}>Zoom in for updated results</Text> : null}
                <MapView
                    region={{
                        latitude: curLat,
                        longitude: curLon,
                        latitudeDelta: latDelta,
                        longitudeDelta: lonDelta,
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
                            this.props.getLocationsConsideringZoom(curLat, curLon, latDelta, lonDelta)
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
    getCurrentLocation: PropTypes.func,
    navigation: PropTypes.object,
    getFavoriteLocations: PropTypes.func,
    clearFilters: PropTypes.func,
    clearError: PropTypes.func,
    error: PropTypes.object,
    getLocationsConsideringZoom: PropTypes.func,
    clearSearchBarText: PropTypes.func,
    setUnitPreference: PropTypes.func,
    updateCoordinates: PropTypes.func,
    updateCoordinatesAndGetLocations: PropTypes.func,
    regions: PropTypes.object,
    login: PropTypes.func,
    getLocationAndMachineCounts: PropTypes.func,
    getOperators: PropTypes.func,
    getMachines: PropTypes.func,
    getLocationTypes: PropTypes.func,
    getRegions: PropTypes.func,
    getLocationsByRegion: PropTypes.func,
}

const mapStateToProps = (state) => {
    const { error, locations, query, regions } = state
    const mapLocations = getMapLocations(state)

    return {
        error,
        query,
        regions,
        mapLocations,
        isFetchingLocations: locations.isFetchingLocations,
    }
}
const mapDispatchToProps = (dispatch) => ({
    getCurrentLocation: (isInitialLoad = false) => dispatch(fetchCurrentLocation(isInitialLoad)),
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
    updateCoordinates: (lat, lon, latDelta, lonDelta) => dispatch(updateCoordinates(lat, lon, latDelta, lonDelta)),
    updateCoordinatesAndGetLocations: (lat, lon) => dispatch(updateCoordinatesAndGetLocations(lat, lon)),
    getLocationsByRegion: (region) => dispatch(getLocationsByRegion(region)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)
