import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Image,
    Platform,
    StyleSheet,
    View,
} from 'react-native'
import {
    Button,
    Icon,
} from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import MapView from 'react-native-maps'
import markerDotHeart from '../assets/images/markerdot-heart.png'

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
    updateMapCoordinates,
} from '../actions'
import {
    getMapLocations
} from '../selectors'
import androidCustomDark from '../utils/androidCustomDark'
import { ThemeContext } from '../theme-context'
import Svg, { G, Circle } from "react-native-svg"

const MenuIcon = (props) => {
    const { numMachines } = props
    let radius
    if (numMachines === 0) {
        radius = 1.5,
        fillColor = '#fa959c',
        strokeColor = '#ffffff'
        strokeWidth = .5
    } else if (numMachines === 1) {
        radius = 2.9,
        fillColor = '#d7fdfb',
        strokeColor = '#f64450'
        strokeWidth = .8
    } else if (numMachines === 2 || numMachines === 3) {
        radius = 3.2,
        fillColor = '#b6fcf7',
        strokeColor = '#f52331'
        strokeWidth = .8
    } else if (numMachines === 4 || numMachines === 5) {
        radius = 3.5,
        fillColor = '#96faf3',
        strokeColor = '#db0a18'
        strokeWidth = .8
    } else if (numMachines < 10) {
        radius = 3.8,
        fillColor = '#75f9f0',
        strokeColor = '#ba0915'
        strokeWidth = .8
    } else if (numMachines < 20) {
        radius = 4.1,
        fillColor = '#55f7ec',
        strokeColor = '#9a0711'
        strokeWidth = .8
    } else {
        radius = 4.4,
        fillColor = '#0becdd',
        strokeColor = '#7a060e'
        strokeWidth = .8
    }
    return (
        <Svg width={48} height={40} >
            <G
                transform="translate(-99.885513,-122.46734)">
                <Circle
                    fill={fillColor}
                    fillOpacity="0.90"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    cx="105.21638"
                    cy="148.88647"
                    r={radius}
                    transform="matrix(2.9741147,0,0,2.9741147,-197.18546,-304.44272)" />
            </G>
        </Svg>
    )
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
            <View>
                {marker.icon === 'dot' ? <MenuIcon numMachines={marker.machine_names.length} /> : <Image source={markerDotHeart} style={{ height: 24, width: 28 }} onLoad={stopRendering} />}
            </View>
            <MapView.Callout onPress={() => navigation.navigate('LocationDetails', { id: marker.id, locationName: marker.name })}>
                <View>
                    <View style={s.calloutStyle}>
                        <Text style={{ marginRight: 20, color: '#000e18' }}>{marker.name}</Text>
                        {marker.machine_names.length === 1 ?
                            <Text style={{ color: '#000e18' }}>1 machine</Text> :
                            <Text style={{ color: '#000e18' }}>{`${marker.machine_names.length} machines`}</Text>
                        }
                    </View>
                    <Ionicons style={s.iconStyle} name="ios-arrow-dropright" />
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
        }
    }

    static navigationOptions = ({ navigation }) => {
        const theme = navigation.state.params && navigation.state.params.theme || ''

        const titleStyle = {
            color: "#1e9dff",
            fontSize: 16,
            fontWeight: Platform.OS === 'ios' ? "600" : "400"
        }

        return {
            headerLeft:
                <Button
                    onPress={() => navigation.navigate('LocationList')}
                    containerStyle={{ width: 50 }}
                    title="List"
                    accessibilityLabel="List"
                    titleStyle={titleStyle}
                    type="clear"
                />,
            headerTitle:
                <Search
                    navigate={navigation.navigate}
                />,
            headerRight:
                <Button
                    onPress={() => navigation.navigate('FilterMap')}
                    containerStyle={{ width: 60 }}
                    title="Filter"
                    accessibilityLabel="Filter"
                    titleStyle={titleStyle}
                    type="clear"
                />,
            headerStyle: {
                backgroundColor: theme === 'dark' ? '#1d1c1d' : '#f5fbff',
            },
        }
    }

    static contextType = ThemeContext;

    onRegionChange = (region) => {
        const compareRegion = (region) => {
            if (region === this.prevRegion) {
                this.props.updateMapCoordinates(region.latitude, region.longitude, region.latitudeDelta, region.longitudeDelta)
            }
        }

        // latitudeDelta is updating when the Search modal opens. This ensures we don't unnecessarily call compareRegion
        if (region.latitude - this.prevRegion.latitude !== 0) {
            setTimeout(compareRegion, 800, region)
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
        this.props.getCurrentLocation()
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
            this.props.updateMapCoordinates(curLat, curLon, latDelta, lonDelta)
        }

    }

    updateTheme(theme) {
        this.setState({ themeState: theme })
        this.props.navigation.setParams({ theme })
    }

    render() {
        const {
            isFetchingLocations,
            mapLocations,
            navigation,
        } = this.props

        const {
            showNoLocationTrackingModal,
        } = this.state

        const { theme } = this.context
        const s = getStyles(theme)

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
            <View style={{ flex: 1, backgroundColor: '#f5fbff' }}>
                <ConfirmationModal
                    visible={showNoLocationTrackingModal}>
                    <View>
                        <Text style={s.confirmText}>Location tracking must be enabled to use this feature!</Text>
                        <PbmButton
                            title={"OK"}
                            onPress={() => this.setState({ showNoLocationTrackingModal: false })}
                            accessibilityLabel="Great!"
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
                <View style={{ flex: 1, position: 'absolute', left: 0, top: 0, bottom: 0, right: 0 }}>
                    <MapView
                        ref={this.mapRef}
                        region={{
                            latitude,
                            longitude,
                            latitudeDelta,
                            longitudeDelta,
                        }}
                        style={s.map}
                        onRegionChange={this.onRegionChange}
                        showsUserLocation={true}
                        moveOnMarkerPress={false}
                        showsMyLocationButton={false}
                        provider = { MapView.PROVIDER_GOOGLE }
                        customMapStyle={theme.theme === 'dark' ? androidCustomDark : []}
                    >
                        {mapLocations.map(l => <CustomMarker key={l.id} marker={l} navigation={navigation} s={s} />)}
                    </MapView>
                    <Icon
                        raised
                        name='gps-fixed'
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
        maxWidth: 300,
        height: 45,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignContent: 'space-around',
        zIndex: 5,
        marginRight: 7,
    },
    iconStyle: {
        fontSize: 22,
        color: '#c1c9cf',
        position: "absolute",
        top: Platform.OS === 'ios' ? 13 : 12,
        right: Platform.OS === 'ios' ? -5 : 2,
        zIndex: 0
    },
    loading: {
        zIndex: 10,
        alignSelf: "center",
        padding: 5,
        backgroundColor: theme.loading,
        color: theme.pbmText,
        fontSize: 14,
        marginTop: 5,
    },
    clear: {
        fontSize: 14,
        color: "#F53240",
        padding: 5,
        backgroundColor: theme.loading
    },
    confirmText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
        marginRight: 10
    },
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
    updateMapCoordinates: (lat, lon, latDelta, lonDelta) => dispatch(updateMapCoordinates(lat, lon, latDelta, lonDelta)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)
