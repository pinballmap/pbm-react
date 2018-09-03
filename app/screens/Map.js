import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { LocationCard, SearchBar } from '../components';
import { setLocationId, updateCurrCoordindates } from '../actions/query_actions';
import { fetchLocations } from '../actions/locations_actions';
import { Ionicons } from '@expo/vector-icons';

class Map extends Component {
  constructor(props){
    super(props);

    this.mapRef = null;
    this.prevRegion = null,

    this.state ={ 
      region: {
        latitude: this.props.user.lat, 
        longitude: this.props.user.lon, 
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      },
      address: '', 
      locations: this.props.locations.mapLocations,
      isRefetchingLocations: this.props.locations.isRefetchingLocations,
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
        />
      };
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
      setTimeout(() => this.mapRef.fitToElements(true), 1000);  
    }
  }

  componentDidMount(){
    this.props.getLocations('/locations/closest_by_lat_lon.json?lat=' + this.state.region.latitude + ';lon=' + this.state.region.longitude + ';send_all_within_distance=1;max_distance=5')
  }

  componentWillReceiveProps(props) {
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

    if (props.locations.isRefetchingLocations !== this.props.locations.isRefetchingLocations) {
      this.setState({ isRefetchingLocations: props.locations.isRefetchingLocations })
    }

    if (props.query.machineId !== this.props.query.machineId) {
      const machine = props.query.machineId ? `by_machine_id=${props.query.machineId};` : ''
      this.props.getLocations(`/locations/closest_by_lat_lon.json?lat=${this.state.region.latitude};lon=${this.state.region.longitude};${machine}max_distance=5;send_all_within_distance=1`, true)
    }

  }

  render(){
    if (this.props.locations.isFetchingLocations) {
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
          {this.state.isRefetchingLocations && <Text style={{textAlign:'center'}}>Loading...</Text>}
          </MapView>
        </View>
      </View>
    );
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
});

const mapStateToProps = ({ locations, query, user }) => ({ locations, query, user })
const mapDispatchToProps = (dispatch) => ({
    getLocations: (url, isRefetch) => dispatch(fetchLocations(url, isRefetch)),
    updateCoordinates: (lat, lon, latDelta, lonDelta) => dispatch(updateCurrCoordindates(lat, lon, latDelta, lonDelta)),
    setLocationId,
})

export default connect(mapStateToProps, mapDispatchToProps)(Map);
