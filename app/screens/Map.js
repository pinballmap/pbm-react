import React, { Component } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, YellowBox, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import "../config/globals.js"

class Map extends Component {
  static navigationOptions = {
    title: 'THE MAP',
  };

  constructor(props){
    super(props);

    this.mapRef = null;
    this.state ={ lat: '', lon: '', zip: '', isLoading: true}

    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillUpdate is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
      'Warning: Failed prop type',
      'Warning: Each child in an array',
    ]);
  }

  componentDidUpdate(){
    if (this.mapRef) {
      setTimeout(() => this.mapRef.fitToElements(true), 1000);
    }
  }

  componentWillMount(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          error: null,
        });

        return this.reloadMap();
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  reloadMap() {
    var url = this.state.zip != '' ?
      global.api_url + '/locations/closest_by_address.json?address=' + this.state.zip + ';send_all_within_distance=1;max_distance=5' :
      global.api_url + '/locations/closest_by_lat_lon.json?lat=' + this.state.lat + ';lon=' + this.state.lon + ';send_all_within_distance=1;max_distance=5'
    ;

    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          markers: responseJson.locations.map(l => (
            <MapView.Marker
              coordinate={{latitude: l.lat, longitude: l.lon, latitudeDelta: 1.00, longitudeDelta: 1.00}}
              title={l.name}
              key={l.id}
            />
          ))
        }, function(){});
      });
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
        <View style={{paddingTop:20}}>
          <Text>PINBALL MAP</Text>
          <View style={{flexDirection: 'row'}}>
            <View>
              <TextInput
                onChangeText={zip => this.setState({zip})}
                style={{width:200, height: 40, borderColor: 'gray', borderWidth: 1}}
                value={this.state.zip}
              />
            </View>
            <View>
              <Button
                onPress={ () => this.reloadMap() }
                style={{width:30, paddingTop: 15}}
                title="Submit"
                accessibilityLabel="Submit"
              />
            </View>
          </View>
        </View>
        <View style ={{flex:1, position: 'absolute',left: 0, top: 75, bottom: 0, right: 0}}>
          <MapView
              ref={this.mapRef}
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
