import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Font } from 'expo'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { SearchBar } from '../components'
import { 
    fetchLocations,
    updateCurrCoordindates,
    fetchCurrentLocation, 
    login, 
    getFavoriteLocations,
    fetchLocationTypes,
    fetchMachines,
    fetchOperators,
    clearFilters,
} from '../actions'
import { retrieveItem } from '../config/utils'
import { Ionicons } from '@expo/vector-icons'

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
            authCheck: false, 
            address: '', 
            locations: this.props.locations.mapLocations ? this.props.locations.mapLocations : [],
        }
    }

    static navigationOptions = ({ navigation }) => {  
        return {
            drawerLabel: 'Map',
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
        <SearchBar
        />,
            headerRight:
        <Button
            onPress={ () => navigation.navigate('FilterMap')}
            containerStyle={{width:60}}
            title="Filter"
            accessibilityLabel="Filter"
            titleStyle={s.titleStyle}
            clear={true}
        />
        }
    };

    reloadMap() { 
        const { machineId, locationType, numMachines, selectedOperator } = this.props.query
        const machineQueryString = machineId ? `by_machine_id=${machineId};` : ''
        const locationTypeQueryString = locationType ? `by_type_id=${locationType};` : ''
        const numMachinesQueryString = numMachines ? `by_at_least_n_machines_type=${numMachines};` : ''
        const byOperator = selectedOperator ? `by_operator_id=${selectedOperator};` : ''
        this.props.getLocations(`/locations/closest_by_lat_lon.json?lat=${this.state.region.latitude};lon=${this.state.region.longitude};${machineQueryString}${locationTypeQueryString}${numMachinesQueryString}${byOperator}max_distance=5;send_all_within_distance=1`, true)  
    }

    onRegionChange = (region) => {
        //Only reload map if the location hasn't moved in 0.5sec
        const compareRegion = (region) => {
            if (region === this.prevRegion) {
                this.setState({ 
                    region, 
                    locations: [], 
                })
                this.props.updateCoordinates(region.latitude, region.longitude, region.latitudeDelta, region.longitudeDelta)
                this.reloadMap()
            }
        }

        setTimeout(compareRegion, 500, region)
        this.prevRegion = region
    }

    componentDidUpdate(){
        if (this.mapRef) {
            setTimeout(() => this.mapRef.fitToElements(true), 1000)  
        }
    }

    componentDidMount(){
    Font.loadAsync({'FontAwesome': require('@expo/vector-icons/fonts/FontAwesome.ttf')})
        retrieveItem('auth').then((auth) => {
            if (!auth && !this.props.user.loginLater) {
                this.props.navigation.navigate('SignupLogin')
            }
            else if (auth) {
                this.setState({ authCheck: true })
                this.props.login(auth)
            } 
            else {
                this.setState({ authCheck: true })
            }
        }).catch((error) => console.log('Promise is rejected with error: ' + error)) 

        this.props.getCurrentLocation()
        this.props.getLocationTypes('/location_types.json')
        this.props.getMachines('/machines.json')
        this.props.getOperators('/operators.json')
    }

    UNSAFE_componentWillReceiveProps(props) {
        const { machineId, locationType, numMachines, selectedOperator, curLat, curLon, latDelta, lonDelta, locationId, locationName } = props.query
        if (!this.props.user.lat && props.user.lat) {
            this.setState({
                region: {
                    ...this.state.region,
                    latitude: props.user.lat, 
                    longitude: props.user.lon, 
                }
            })
            this.props.getLocations('/locations/closest_by_lat_lon.json?lat=' + props.user.lat + ';lon=' + props.user.lon + ';send_all_within_distance=1;max_distance=5')
        }
        
        if (!this.props.user.id && props.user.id) {
            this.props.getFavoriteLocations(props.user.id)
        }

        if (locationId !== this.props.query.locationId) {
            this.props.navigation.navigate('LocationDetails', {id: locationId.toString(), locationName})
        }

        if (props.locations.mapLocations !== this.props.locations.mapLocations) {
            this.setState({ locations: props.locations.mapLocations })
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
            this.props.getLocations(`/locations/closest_by_lat_lon.json?lat=${this.state.region.latitude};lon=${this.state.region.longitude};${machine}${byLocationType}${byNumMachines}${byOperator}max_distance=5;send_all_within_distance=1`, true)
        }

    }

    render(){
        const { isFetchingLocations, isRefetchingLocations } = this.props.locations
        const { machineId = false, locationType = false, numMachines = false, selectedOperator = false } = this.props.query
        const filterApplied = machineId || locationType || numMachines || selectedOperator ? true : false

        if (!this.state.authCheck) {
            return (
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        } 

        if (isFetchingLocations || !this.state.region.latitude) {
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }

        return(
            <View style={{flex: 1}}>
                <View style={s.filter}>
                    <Icon
                        raised
                        name='location-arrow'
                        type='font-awesome'
                        color='#4b5862'
                        size={20}
                        onPress={() => {
                            this.props.getLocations('/locations/closest_by_lat_lon.json?lat=' + this.props.user.lat + ';lon=' + this.props.user.lon + ';send_all_within_distance=1;max_distance=5', true)
                            this.props.updateCoordinates(this.props.user.lat, this.props.user.lon)
                        }}
                    />
                </View>                
                {filterApplied ? 
                    <View style={s.filter}>
                        <Button 
                            title={'Clear Filter'} 
                            onPress={() => this.props.clearFilters()}
                            clear={true}
                            containerStyle={{width:100,position:'absolute',right:0}}
                            titleStyle={{fontSize:14,color:"#F53240"}}
                        />
                    </View> : null                                    
                }
                {isRefetchingLocations ? <Text style={s.loading}>Loading...</Text> : null}
                <View style ={{flex:1, position: 'absolute',left: 0, top: 0, bottom: 0, right: 0}}>
                    <MapView
                        ref={this.mapRef}
                        region={this.state.region}
                        provider={ PROVIDER_GOOGLE }
                        style={s.map}
                        onRegionChange={this.onRegionChange}
                    >
                        {this.state.locations ? this.state.locations.map(l => (
                            <MapView.Marker
                                coordinate={{
                                    latitude: Number(l.lat), 
                                    longitude: Number(l.lon), 
                                    latitudeDelta: this.state.region.latitudeDelta, 
                                    longitudeDelta: this.state.region.longitudeDelta,
                                }}
                                title={l.name}
                                key={l.id}
                            >
                                <MapView.Callout onPress={() => this.props.navigation.navigate('LocationDetails', {id: l.id, locationName: l.name})}>
                                    <View style={s.calloutStyle}>
                                        <Text>{l.name}</Text>
                                        <Ionicons style={s.iconStyle} name="ios-arrow-dropright"/>
                                    </View>
                                </MapView.Callout>
                            </MapView.Marker>
                        )) : null}
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
        color:"#260204",
        fontSize:16,
    }, 
    loading: {
        textAlign: 'center',
        zIndex: 10, 
        fontSize: 16,
    },
    filter: {
        zIndex: 10, 
    },
    location: {
        backgroundColor:"#f5fbff",
        width: 40,
        height: 40,
        borderRadius: 20,
        elevation: 0,
    },
})

Map.propTypes = {
    locations: PropTypes.object,
    query: PropTypes.object,
    user: PropTypes.object,
    getLocationTypes: PropTypes.func,
    getMachines: PropTypes.func,
    getCurrentLocation: PropTypes.func,
    getOperators: PropTypes.func,
    getLocations: PropTypes.func,
    updateCoordinates: PropTypes.func,
    login: PropTypes.func,
    navigation: PropTypes.object,
    getFavoriteLocations: PropTypes.func,
    clearFilters: PropTypes.func,
}

const mapStateToProps = ({ locations, query, user }) => ({ locations, query, user })
const mapDispatchToProps = (dispatch) => ({
    getLocationTypes: (url) => dispatch(fetchLocationTypes(url)),
    getMachines: (url) =>  dispatch(fetchMachines(url)),
    getCurrentLocation: () => dispatch(fetchCurrentLocation()),
    getOperators: (url) => dispatch(fetchOperators(url)),
    getLocations: (url, isRefetch) => dispatch(fetchLocations(url, isRefetch)),
    updateCoordinates: (lat, lon, latDelta, lonDelta) => dispatch(updateCurrCoordindates(lat, lon, latDelta, lonDelta)),
    login: credentials => dispatch(login(credentials)),
    getFavoriteLocations: (id) => dispatch(getFavoriteLocations(id)),
    clearFilters: () => dispatch(clearFilters()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)
