import React, { Component } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { LocationCard } from '../components';
import { retrieveItem } from '../config/utils';
import "../config/globals.js"

class Map extends Component {
  constructor(props){
    super(props);

    this.mapRef = null;
    this.state ={ lat: null, lon: null, address: '', isLoading: true}
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerLeft:
        <Button
          onPress={ () => navigation.navigate('LocationList') }
          style={{width:30, paddingTop: 15}}
          title="List"
          accessibilityLabel="List"
        />,
      title:
        <View style={{flexDirection: 'row'}}>
          <TextInput
            onChangeText={address => params.updateAddress({address})}
            style={{width:100, height: 40, borderColor: 'gray', borderWidth: 1}}
          />
          <Button
            onPress={() =>  params.reloadMap() }
            style={{width:30, paddingTop: 15}}
            title="Submit"
            accessibilityLabel="Submit"
          />
        </View>,
      headerRight:
        <Button
          onPress={ () => navigation.navigate('FilterMap')}
          style={{width:30, paddingTop: 15}}
          title="Filter"
          accessibilityLabel="Filter"
        />
    };
  };

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

  async reloadMap() {
    var url = this.state.address != '' ?
      global.api_url + '/locations/closest_by_address.json?address=' + this.state.address + ';send_all_within_distance=1;max_distance=5' :
      global.api_url + '/locations/closest_by_lat_lon.json?lat=' + this.state.lat + ';lon=' + this.state.lon + ';send_all_within_distance=1;max_distance=5'
    ;

    const response = await fetch(url);
    const responseJson = await response.json();

    this.setState({
      isLoading: false,
      markers: responseJson.locations.map(l => (
        <MapView.Marker
          coordinate={{
            latitude: Number(l.lat), 
            longitude: Number(l.lon), 
            latitudeDelta: 1.00, 
            longitudeDelta: 1.00,
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
                // type={item.location_type_id ? this.state.locationTypes.find(location => location.id === item.location_type_id).name : ""}
                type={""}
                //navigation={this.props.navigation}
                id={l.id} />
          </MapView.Callout>
        </MapView.Marker>
      ))
    })
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
                latitudeDelta: 1.00, 
                longitudeDelta: 1.00
              }}
              provider={ PROVIDER_GOOGLE }
              style={styles.map}
          >
            {this.state.markers}
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

export default Map;
