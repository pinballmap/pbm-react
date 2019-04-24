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
import MapView, { UrlTile } from 'react-native-maps'
import markerDot from '../assets/images/markerdot.png'
import { PbmButton, ConfirmationModal, Search, Text } from '../components'
import { 
    fetchCurrentLocation, 
    fetchLocations,
    updateCurrCoordinates,
    getFavoriteLocations,
    clearFilters,
    clearError,
} from '../actions'
import { 
    headerStyle,
    headerTitleStyle, 
} from '../styles'

class Map extends Component {
    constructor(props){
        super(props)

        this.mapRef = null
        this.prevRegion = null,

        this.state ={ 
            region: {
                latitude: this.props.user.lat, 
                longitude: this.props.user.lon, 
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            },
            address: '', 
            fontAwesomeLoaded: false,
            showNoLocationTrackingModal: false,
        }
    }

    static navigationOptions = ({ navigation }) => {  
        return {
            headerLeft:
        <Button
            onPress={ () => navigation.navigate('LocationList') }
            containerStyle={{width:45}}
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

    reloadMap() { 
        const { machineId, locationType, numMachines, selectedOperator } = this.props.query
        const machineQueryString = machineId ? `by_machine_id=${machineId};` : ''
        const locationTypeQueryString = locationType ? `by_type_id=${locationType};` : ''
        const numMachinesQueryString = numMachines ? `by_at_least_n_machines_type=${numMachines};` : ''
        const byOperator = selectedOperator ? `by_operator_id=${selectedOperator};` : ''
        this.props.getLocations(`/locations/closest_by_lat_lon.json?lat=${this.state.region.latitude};lon=${this.state.region.longitude};${machineQueryString}${locationTypeQueryString}${numMachinesQueryString}${byOperator}max_distance=${global.MAX_DISTANCE};send_all_within_distance=1`, true)  
    }

    onRegionChange = (region) => {
        //Only reload map if the location hasn't moved in 0.5sec
        const compareRegion = (region) => {
            if (region === this.prevRegion) {
                this.setState({ 
                    region, 
                })
                this.props.updateCoordinates(region.latitude, region.longitude, region.latitudeDelta, region.longitudeDelta)
                this.reloadMap()
            }
        }

        setTimeout(compareRegion, 500, region)
        this.prevRegion = region
    }

    updateCurrentLocation = () => {
        const { lat, lon } = this.props.user
        this.props.getLocations(`/locations/closest_by_lat_lon.json?lat=${lat};lon=${lon};send_all_within_distance=1;max_distance=${global.MAX_DISTANCE}`, true)
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
        const { machineId, locationType, numMachines, selectedOperator, curLat, curLon, latDelta, lonDelta } = props.query
        if (!this.props.user.lat && props.user.lat) {
            this.setState({
                region: {
                    ...this.state.region,
                    latitude: props.user.lat, 
                    longitude: props.user.lon, 
                }
            })
            this.props.getLocations(`/locations/closest_by_lat_lon.json?lat=${props.user.lat};lon=${props.user.lon};send_all_within_distance=1;max_distance=${global.MAX_DISTANCE}`)
        }

        if (curLat !== this.props.query.curLat || curLon !== this.props.query.curLon ) {
            this.setState({
                region: {
                    latitude: curLat,
                    longitude: curLon,
                    latitudeDelta: latDelta,
                    longitudeDelta: lonDelta,
                }
            })
        }

        if (machineId !== this.props.query.machineId || locationType !== this.props.query.locationType || numMachines !== this.props.query.numMachines || selectedOperator !== this.props.query.selectedOperator) {
            const machine = machineId ? `by_machine_id=${machineId};` : ''
            const byLocationType = locationType ? `by_type_id=${locationType};` : ''
            const byNumMachines = numMachines ? `by_at_least_n_machines_type=${numMachines};` : ''
            const byOperator = selectedOperator ? `by_operator_id=${selectedOperator};` : ''
            this.props.getLocations(`/locations/closest_by_lat_lon.json?lat=${this.state.region.latitude};lon=${this.state.region.longitude};${machine}${byLocationType}${byNumMachines}${byOperator}max_distance=${global.MAX_DISTANCE};send_all_within_distance=1`, true)
        }

    }

    render(){
        const { isFetchingLocations, isRefetchingLocations, mapLocations = [] } = this.props.locations
        const { fontAwesomeLoaded, showNoLocationTrackingModal } = this.state
        const { locationTrackingServicesEnabled } = this.props.user
        const { errorText = false } = this.props.error
        const { machineId = false, locationType = false, numMachines = false, selectedOperator = false } = this.props.query
        const filterApplied = machineId || locationType || numMachines || selectedOperator ? true : false
    
        if (isFetchingLocations || !this.state.region.latitude) {
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
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', zIndex: 10}}>
                    <View>
                        {fontAwesomeLoaded ? <Icon
                            raised
                            name='location-arrow'
                            type='font-awesome'
                            color='#1e9dff'
                            containerStyle={Platform.OS === "ios" ? {position:'absolute'} : {}}
                            size={20}
                            onPress={() => {
                                locationTrackingServicesEnabled ? this.updateCurrentLocation() : this.setState({ showNoLocationTrackingModal: true })
                            }}
                        /> : null}
                    </View>                
                    <View>
                        {filterApplied ?     
                            <Button 
                                title={'Clear Filter'} 
                                onPress={() => this.props.clearFilters()}
                                clear={true}
                                titleStyle={{fontSize:14,color:"#F53240"}}
                                containerStyle={Platform.OS === "ios" ? {width:100,position:'absolute',right:0} : {}}
                            />
                            : null                                    
                        }
                    </View>
                </View>
                {isRefetchingLocations ? <Text style={s.loading}>Loading...</Text> : null}
                <View style ={{flex:1, position: 'absolute',left: 0, top: 0, bottom: 0, right: 0}}>
                    <MapView
                        ref={this.mapRef}
                        region={this.state.region}
                        style={s.map}
                        onRegionChange={this.onRegionChange}
                        mapType={'none'}
                    >
                        <UrlTile
                            urlTemplate={`http://a.tile.openstreetmap.org/{z}/{x}/{y}.png`}
                            //urlTemplate={`https://mapserver.pinballmap.com/styles/osm-bright/{z}/{x}/{y}.png`}
                            maximumZ={20}
                        />
                        {mapLocations.map(l => (
                            <MapView.Marker
                                coordinate={{
                                    latitude: Number(l.lat), 
                                    longitude: Number(l.lon), 
                                    latitudeDelta: this.state.region.latitudeDelta, 
                                    longitudeDelta: this.state.region.longitudeDelta,
                                }}
                                title={l.name}
                                key={l.id}  
                                image={markerDot}                            
                            >
                                <MapView.Callout onPress={() => this.props.navigation.navigate('LocationDetails', {id: l.id, locationName: l.name})}>
                                    <View style={s.calloutStyle}>
                                        <Text>{l.name}</Text>
                                        <Ionicons style={s.iconStyle} name="ios-arrow-dropright"/>
                                    </View>
                                </MapView.Callout>
                            </MapView.Marker>
                        ))}
                    </MapView>
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
        textAlign: 'center',
        zIndex: 10, 
        fontSize: 14,
        marginTop: Platform.OS === 'ios' ? 5 : -45,
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
    locations: PropTypes.object,
    query: PropTypes.object,
    user: PropTypes.object,
    getCurrentLocation: PropTypes.func,
    getLocations: PropTypes.func,
    updateCoordinates: PropTypes.func,
    navigation: PropTypes.object,
    getFavoriteLocations: PropTypes.func,
    clearFilters: PropTypes.func,
    clearError: PropTypes.func,
    error: PropTypes.object,
}

const mapStateToProps = ({ error, locations, query, user }) => ({ error, locations, query, user })
const mapDispatchToProps = (dispatch) => ({
    getCurrentLocation: () => dispatch(fetchCurrentLocation()),
    getLocations: (url, isRefetch) => dispatch(fetchLocations(url, isRefetch)),
    updateCoordinates: (lat, lon, latDelta, lonDelta) => dispatch(updateCurrCoordinates(lat, lon, latDelta, lonDelta)),
    getFavoriteLocations: (id) => dispatch(getFavoriteLocations(id)),
    clearFilters: () => dispatch(clearFilters()),
    clearError: () => dispatch(clearError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)
