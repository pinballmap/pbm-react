import React, { Component } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, YellowBox, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

class Pbm extends Component {

  constructor(props){
    super(props);

    this.mapRef = null;
    this.state ={ zip: '', isLoading: true}

    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillUpdate is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
      'Warning: Failed prop type',
      'Warning: Each child in an array',
    ]);
  }

  componentDidMount(){
    return fetch('https://pinballmap.com/api/v1/locations/closest_by_zip.json?zip=' + this.state.zip + ';send_all_within_distance=1;max_distance=5')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          markers: responseJson.locations.map(l => (
            <MapView.Marker
              coordinate={{latitude: l.lat, longitude: l.lon, latitudeDelta: 1.00, longitudeDelta: 1.00}}
              title={l.name}
            />
          ))
        }, function(){});

        this.refs.map.fitToElements(true);
      });
  }

  reloadMap(event) {
    return fetch('https://pinballmap.com/api/v1/locations/closest_by_zip.json?zip=' + this.state.zip + ';send_all_within_distance=1;max_distance=5')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          markers: responseJson.locations.map(l => (
            <MapView.Marker
              coordinate={{latitude: l.lat, longitude: l.lon, latitudeDelta: 1.00, longitudeDelta: 1.00}}
              title={l.name}
            />
          ))
        }, function(){});

        this.refs.map.fitToElements(true);
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
                style={{width:100, height: 40, borderColor: 'gray', borderWidth: 1}}
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
              ref="map"
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
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1
  },
  map: {
    flex: 1
  },
});

export default Pbm;
