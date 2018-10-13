import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { SearchBar } from '../components'
import { updateCurrCoordindates } from '../actions/query_actions'
import { fetchLocations } from '../actions/locations_actions'
import { fetchCurrentLocation, login } from '../actions/user_actions'
import { fetchLocationTypes } from '../actions/locations_actions'
import { fetchMachines } from '../actions/machines_actions'
import { fetchOperators } from '../actions/operators_actions'
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
            locations: this.props.locations.mapLocations,
        }
    }

  static navigationOptions = ({ navigation }) => {  
      return {
          headerLeft:
        <Button
            onPress={ () => navigation.navigate('LocationList') }
            style={{width:30, paddingTop: 15}}
            title="List"
            accessibilityLabel="List"
            color="#888888"
        />,
          headerTitle:
        <SearchBar
        />,
          headerRight:
        <Button
            onPress={ () => navigation.navigate('FilterMap')}
            style={{width:30, paddingTop: 15}}
            title="Filter"
            accessibilityLabel="Filter"
            color="#888888"
        />
      }
  };

  reloadMap() { 
      this.props.getLocations(`/locations/closest_by_lat_lon.json?lat=${this.state.region.latitude};lon=${this.state.region.longitude};max_distance=5;send_all_within_distance=1`, true)  
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
      this.props.getMachines('/machines.json?no_details=1')
      this.props.getOperators('/operators.json')
  }

  componentWillReceiveProps(props) {
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

      if (props.query.locationId !== this.props.query.locationId) {
          this.props.navigation.navigate('LocationDetails', {id: props.query.locationId.toString(), locationName: props.query.locationName})
      }

      if (props.locations.mapLocations !== this.props.locations.mapLocations) {
          this.setState({ locations: props.locations.mapLocations })
      }

      if (props.query.curLat !== this.props.query.curLat || props.query.curLon !== this.props.query.curLon ) {
          this.setState({
              region: {
                  latitude: props.query.curLat,
                  longitude: props.query.curLon,
                  latitudeDelta: props.query.latDelta,
                  longitudeDelta: props.query.lonDelta,

              }
          })
      }

      if (props.query.machineId !== this.props.query.machineId || props.query.locationType !== this.props.query.locationType || props.query.numMachines !== this.props.query.numMachines) {
          const machine = props.query.machineId ? `by_machine_id=${props.query.machineId};` : ''
          const locationType = props.query.locationType ? `by_type_id=${props.query.locationType};` : ''
          const numMachines = props.query.numMachines ? `by_at_least_n_machines_type=${props.query.numMachines};` : ''
          this.props.getLocations(`/locations/closest_by_lat_lon.json?lat=${this.state.region.latitude};lon=${this.state.region.longitude};${machine}${locationType}${numMachines}max_distance=5;send_all_within_distance=1`, true)
      }

  }

  render(){
      if (!this.state.authCheck) {
          return (
              <View style={{flex: 1, padding: 20}}>
                  <ActivityIndicator/>
              </View>
          )
      } 

      if (this.props.locations.isFetchingLocations || !this.state.region.latitude) {
          return(
              <View style={{flex: 1, padding: 20}}>
                  <ActivityIndicator/>
              </View>
          )
      }

      return(
          <View style={{flex: 1}}>
              <View style ={{flex:1, position: 'absolute',left: 0, top: 0, bottom: 0, right: 0}}>
                  <MapView
                      ref={this.mapRef}
                      region={this.state.region}
                      provider={ PROVIDER_GOOGLE }
                      style={s.map}
                      onRegionChange={this.onRegionChange}
                  >
                      {this.state.locations && this.state.locations.map(l => (
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
                      ))}
                      {this.props.locations.isRefetchingLocations ? <Text style={{textAlign:'center'}}>Loading...</Text> : <Text></Text>}
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
        color: '#cccccc',
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
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)
