import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Font } from 'expo'
import { 
    ActivityIndicator,
    Image,
    Platform,
    StyleSheet, 
    View,
} from 'react-native'
import { Button, Icon } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import { MapView } from 'expo'
import markerDot from '../assets/images/markerdot.png'
import markerDotHeart from '../assets/images/markerdot-heart.png'
import { PbmButton, ConfirmationModal, Search, Text } from '../components'
import { 
    fetchCurrentLocation, 
    updateFilterLocations,
    getFavoriteLocations,
    clearFilters,
    clearError,
    updateMapCoordinates,
} from '../actions'
import { 
    headerStyle,
    headerTitleStyle, 
} from '../styles'
import {
    getMapLocations
} from '../selectors'

class CustomMarker extends Component
{

    state = {
        tracksViewChanges: true,
    }

    stopRendering = () => {
        this.setState({ tracksViewChanges: false })
    }

    render()
    {
        const { marker, navigation } = this.props

        return (
            <MapView.Marker
                key={marker.id}
                coordinate={{
                    latitude: Number(marker.lat), 
                    longitude: Number(marker.lon)
                }}
                title={marker.title}
                tracksViewChanges={this.state.tracksViewChanges}
            >
                <View>
                    {marker.icon === 'dot' ? <Image source={markerDot} style={{height:20,width:20}} onLoad={this.stopRendering} /> : <Image source={markerDotHeart} style={{height:24,width:28}} onLoad={this.stopRendering} />}
                </View>
                <MapView.Callout onPress={() => navigation.navigate('LocationDetails', {id: marker.id, locationName: marker.name})}>
                    <View>
                        <View style={s.calloutStyle}>
                            <Text style={{marginRight:20}}>{marker.name}</Text>
                            {marker.machine_names.length === 1 ? 
                                <Text>1 machine</Text> :
                                <Text>{`${marker.machine_names.length} machines`}</Text>
                            }
                        </View>
                        <Ionicons style={s.iconStyle} name="ios-arrow-dropright"/>
                    </View>
                </MapView.Callout>
            </MapView.Marker>
        )
    }

}

class Map extends Component {
    constructor(props){
        super(props)

        this.mapRef = null
        this.prevRegion = {}

        this.state ={ 
            materialIconsLoaded: false,
            showNoLocationTrackingModal: false,
            maxedOutZoom: false,
        }
    }

    static navigationOptions = ({ navigation }) => {  
        return {
            headerLeft:
        <Button
            onPress={ () => navigation.navigate('LocationList') }
            containerStyle={{width:50}}
            title="List"
            accessibilityLabel="List"
            titleStyle={s.titleStyle}
            clear={true}
        />,
            headerTitle:
        <Search 
            navigate={ navigation.navigate }
        />,
            headerRight:
        <Button
            onPress={ () => navigation.navigate('FilterMap')}
            containerStyle={{width:60}}
            title="Filter"
            accessibilityLabel="Filter"
            titleStyle={s.titleStyle}
            clear={true}
        />,
            headerTitleStyle,
            headerStyle,
            headerTintColor: '#4b5862'
        }
    };


    onRegionChange = (region) => {
        //Only reload map if the location hasn't moved in 0.2sec
        const compareRegion = (region) => {
            if (region === this.prevRegion) {
                this.props.updateMapCoordinates(region.latitude, region.longitude, region.latitudeDelta, region.longitudeDelta)
            }
        }

        setTimeout(compareRegion, 200, region)
        this.prevRegion = region
    }

    updateCurrentLocation = () => {
        this.props.getCurrentLocation()
    }

    componentDidUpdate(){
        if (this.mapRef) {
            setTimeout(() => this.mapRef.fitToElements(true), 1000)
        }
    }

    async componentDidMount(){
        this.props.getCurrentLocation()
        
        await Font.loadAsync({'MaterialIcons': require('@expo/vector-icons/fonts/MaterialIcons.ttf')})
        await Font.loadAsync({'Material Icons': require('@expo/vector-icons/fonts/MaterialIcons.ttf')})
        this.setState({ materialIconsLoaded: true })
    }

    UNSAFE_componentWillReceiveProps(props) {
        const { machineId, locationType, numMachines, selectedOperator, viewByFavoriteLocations } = props.query

        if (machineId !== this.props.query.machineId || locationType !== this.props.query.locationType || numMachines !== this.props.query.numMachines || selectedOperator !== this.props.query.selectedOperator || viewByFavoriteLocations !== this.props.query.viewByFavoriteLocations) {
            this.props.updateFilterLocations()
        }

    }

    render(){
        const { 
            isFetchingLocations, 
            mapLocations,
            navigation,
        } = this.props
        
        const { 
            materialIconsLoaded, 
            showNoLocationTrackingModal 
        } = this.state
        
        const { locationTrackingServicesEnabled } = this.props.user
        const { errorText = false } = this.props.error
        const { machineId = false, locationType = false, numMachines = false, selectedOperator = false, viewByFavoriteLocations, curLat: latitude, curLon: longitude, latDelta: latitudeDelta, lonDelta: longitudeDelta, maxZoom } = this.props.query
        const filterApplied = machineId || locationType || numMachines || selectedOperator || viewByFavoriteLocations ? true : false

        if (!latitude) {
            return(
                <View style={{flex: 1, padding: 20,backgroundColor:'#f5fbff'}}>
                    <ActivityIndicator/>
                </View>
            )
        }

        return(
            <View style={{flex: 1,backgroundColor:'#f5fbff'}}>
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
                <View style ={{flex:1, position: 'absolute',left: 0, top: 0, bottom: 0, right: 0}}>
                    <MapView
                        ref={this.mapRef}
                        region={{
                            latitude,
                            longitude,
                            latitudeDelta,
                            longitudeDelta,
                        }}
                        provider={"google"}
                        style={s.map}
                        onRegionChange={this.onRegionChange}
                        showsUserLocation={true}
                        moveOnMarkerPress={false}
                    >
                        {mapLocations.map(l => <CustomMarker key={l.id} marker={l} navigation={navigation} /> )}
                    </MapView>
                    {materialIconsLoaded ? <Icon
                        raised
                        name='gps-fixed'
                        type='material'
                        color='#1e9dff'
                        containerStyle={{position:'absolute',bottom:0,right:0}}
                        size={24}
                        onPress={() => {
                            locationTrackingServicesEnabled ? this.updateCurrentLocation() : this.setState({ showNoLocationTrackingModal: true })
                        }}
                    /> : null}
                    {filterApplied ?     
                        <Button 
                            title={'Clear Filter'} 
                            onPress={() => this.props.clearFilters()}
                            clear={true}
                            titleStyle={{fontSize:14,color:"#F53240",padding: 5,backgroundColor:'rgba(255,255,255,0.5)'}}
                            containerStyle={{width:100,position:'absolute',top:0,right:0}}
                        />
                        : null                                    
                    }
                </View>
            </View>
        )
    }
}

const s = StyleSheet.create({
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
    titleStyle: {
        color: "#1e9dff",
        fontSize: 16,
        fontWeight: Platform.OS === 'ios' ? "600" : "400"
    }, 
    loading: {
        zIndex: 10, 
        alignSelf : "center",
        padding: 5,
        backgroundColor:'rgba(255,255,255,0.5)',
        fontSize: 14,
        marginTop: 5,
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
    updateFilterLocations: PropTypes.func,
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
    updateFilterLocations: () => dispatch(updateFilterLocations()),
    getFavoriteLocations: (id) => dispatch(getFavoriteLocations(id)),
    clearFilters: () => dispatch(clearFilters()),
    clearError: () => dispatch(clearError()),
    updateMapCoordinates: (lat, lon, latDelta, lonDelta) => dispatch(updateMapCoordinates(lat, lon, latDelta, lonDelta)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)
