import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { LocationCard, SearchBar } from '../components';
import { setLocationId } from '../actions/query_actions';
import { fetchLocations } from '../actions/location_actions';
import { retrieveItem } from '../config/utils';
import "../config/globals.js"

class Map extends Component {
  constructor(props){
    super(props);

    this.mapRef = null;
    this.state ={ 
      lat: null, 
      lon: null, 
      latitudeDelta: 1.000,
      longitudeDelta: 1.000,
      address: '', 
      isLoading: true,
      locations: this.props.locations.locations,
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
          <SearchBar />,
      headerRight:
        <Button
          onPress={ () => navigation.navigate('FilterMap')}
          style={{width:30, paddingTop: 15}}
          title="Filter"
          accessibilityLabel="Filter"
        />
    };
  };

  async reloadMap(location) {
    if (location) {
      this.props.navigation.navigate('LocationDetails', {id: this.props.query.locationId.toString(), type: ""})
    }  
    else {    
      this.props.getLocations('/locations/closest_by_lat_lon.json?lat=' + this.state.lat + ';lon=' + this.state.lon + ';send_all_within_distance=1;max_distance=5')

      this.setState({
        isLoading: false,
      })
    }
  }

  onRegionChange = (region) => {
    this.setState({ 
      lat: region.latitude, 
      lon: region.longitude, 
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    })

    this.reloadMap()
  }

  componentDidUpdate(){
    if (this.mapRef) {
      setTimeout(() => this.mapRef.fitToElements(true), 1000);
    }
  }

  componentDidMount(){
    this.props.navigation.setParams({
      reloadMap: this.reloadMap.bind(this),
      updateAddress: this.updateAddress.bind(this),
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          lat: Number(position.coords.latitude),
          lon: Number(position.coords.longitude),
          error: null,
        });

        this.reloadMap();
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );

    retrieveItem('authToken').then((authToken) => {
      this.setState({ authToken })
      }).catch((error) => {
      console.log('Promise is rejected with error: ' + error);
      }); 
  }

  updateAddress(address) {
    this.setState(address);
  }

  componentWillReceiveProps(props) {
    if (props.query.locationId !== this.props.query.locationId) {
      this.reloadMap(true)
    }

    if (props.locations.locations !== this.props.locations.locations) {
      this.setState({ locations: props.locations.locations })
    }

  }

  render(){
    if(this.state.isLoading){
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
              region={{
                latitude: this.state.lat, 
                longitude: this.state.lon,
                latitudeDelta: this.state.latitudeDelta, 
                longitudeDelta: this.state.longitudeDelta,
              }}
              provider={ PROVIDER_GOOGLE }
              style={styles.map}
              onRegionChange={this.onRegionChange}
          >
          {this.state.locations.map(l => (
            <MapView.Marker
              coordinate={{
                latitude: Number(l.lat), 
                longitude: Number(l.lon), 
                latitudeDelta: this.state.latitudeDelta, 
                longitudeDelta: this.state.longitudeDelta,
              }}
              title={l.name}
              key={l.id}
            >
              <MapView.Callout  onPress={() => this.props.navigation.navigate('LocationDetails', {id: l.id, type: ""})}>
                <LocationCard
                    name={l.name}
                    distance={l.distance}
                    street={l.street}
                    state={l.state}
                    zip={l.zip}
                    machines={l.machine_names} 
                    type={l.location_type_id ? this.props.location_types.locationTypes.find(location => location.id === l.location_type_id).name : ""}
                    //navigation={this.props.navigation}
                    id={l.id} />
              </MapView.Callout>
            </MapView.Marker>
          ))}
          </MapView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
});

const mapStateToProps = ({ locations, location_types, query }) => ({ locations, location_types, query })
const mapDispatchToProps = (dispatch) => ({
    getLocations: (url) => dispatch(fetchLocations(url)),
    setLocationId,
})

export default connect(mapStateToProps, mapDispatchToProps)(Map);
