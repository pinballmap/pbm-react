import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Font } from 'expo'
import { 
    ActivityIndicator,
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
    updateCurrCoordinates,
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

class Map extends Component {
    constructor(props){
        super(props)

        this.mapRef = null
        this.prevRegion = {}

        this.state ={ 
            fontAwesomeLoaded: false,
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
        const { lat, lon } = this.props.user
        this.props.updateCoordinates(lat, lon)
    }

    componentDidUpdate(){
        if (this.mapRef) {
            setTimeout(() => this.mapRef.fitToElements(true), 1000)
        }
    }

    async componentDidMount(){
        this.props.getCurrentLocation()
        await Font.loadAsync({'FontAwesome': require('@expo/vector-icons/fonts/FontAwesome.ttf')})
        this.setState({ fontAwesomeLoaded: true })
    }

    UNSAFE_componentWillReceiveProps(props) {
        const { machineId, locationType, numMachines, selectedOperator, curLat, curLon, viewByFavoriteLocations } = props.query
        if (!this.props.query.curLat && curLat)
            this.props.updateCoordinates(curLat, curLon)

        if (machineId !== this.props.query.machineId || locationType !== this.props.query.locationType || numMachines !== this.props.query.numMachines || selectedOperator !== this.props.query.selectedOperator || viewByFavoriteLocations !== this.props.query.viewByFavoriteLocations) {
            this.props.updateFilterLocations()
        }

    }

    render(){
        const { 
            isFetchingLocations, 
            mapLocations,
        } = this.props
        
        const { 
            fontAwesomeLoaded, 
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
                        style={s.map}
                        onRegionChange={this.onRegionChange}
                        mapType={'none'}
                        showsUserLocation={true}
                    >
                        <MapView.UrlTile
                            urlTemplate={`http://a.tile.openstreetmap.org/{z}/{x}/{y}.png`}
                            //urlTemplate={`https://mapserver.pinballmap.com/styles/osm-bright/{z}/{x}/{y}.png`}
                            maximumZ={20}
                        />
                        {mapLocations.map(l => (
                            <MapView.Marker
                                coordinate={{
                                    latitude: Number(l.lat), 
                                    longitude: Number(l.lon), 
                                }}
                                title={l.name}
                                key={l.id}  
                                image={l.icon === 'dot' ? markerDot : markerDotHeart}               
                            >
                                <MapView.Callout onPress={() => this.props.navigation.navigate('LocationDetails', {id: l.id, locationName: l.name})}>
                                    <View style={s.calloutStyle}>
                                        <View>
                                            <Text>{l.name}</Text>
                                            {l.machine_names.length === 1 ? 
                                                <Text>1 machine</Text> :
                                                <Text>{`${l.machine_names.length} machines`}</Text>
                                            }
                                        </View>
                                        <Ionicons style={s.iconStyle} name="ios-arrow-dropright"/>
                                    </View>
                                </MapView.Callout>
                            </MapView.Marker>
                        ))}
                    </MapView>
                    {fontAwesomeLoaded ? <Icon
                        raised
                        name='location-arrow'
                        type='font-awesome'
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
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'center', 
        alignContent: 'space-around',
    },
    iconStyle: {
        marginLeft: 15,
        fontSize: 22,
        color: '#97a5af',
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
    updateCoordinates: PropTypes.func,
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
    updateCoordinates: (lat, lon, latDelta, lonDelta) => dispatch(updateCurrCoordinates(lat, lon, latDelta, lonDelta)),
    getFavoriteLocations: (id) => dispatch(getFavoriteLocations(id)),
    clearFilters: () => dispatch(clearFilters()),
    clearError: () => dispatch(clearError()),
    updateMapCoordinates: (lat, lon, latDelta, lonDelta) => dispatch(updateMapCoordinates(lat, lon, latDelta, lonDelta)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)
