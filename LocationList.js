import React, { Component } from 'react';
import { ActivityIndicator, Button, StyleSheet, YellowBox, Text, TextInput, View } from 'react-native';

class LocationList extends Component {

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

  componentWillMount(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          error: null,
        });

        return this.reloadSections();
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  reloadSections(event) {
    var url = this.state.zip != '' ?
      'https://pinballmap.com/api/v1/locations/closest_by_zip.json?zip=' + this.state.zip + ';send_all_within_distance=1;max_distance=5' :
      'https://pinballmap.com/api/v1/locations/closest_by_lat_lon.json?lat=' + this.state.lat + ';lon=' + this.state.lon + ';send_all_within_distance=1;max_distance=5'
    ;

    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        var locations = {};
        var locationDict = {};

        for (var i in responseJson.locations) {
          var location = responseJson.locations[i];
          var firstCharacter = location.name.charAt(0).toUpperCase();

          if (!(firstCharacter in locationDict)) {
            locationDict[firstCharacter] = []
          }

          locationDict[firstCharacter].push(location.name);
        }

        locations = Object.keys(locationDict).map((key, index) => (
          {title: key, data: locationDict[key]}
        ));

        locations.sort((a, b) => a.title > b.title);

        this.setState({
          isLoading: false,
          locations: locations,
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
                onPress={ () => this.reloadSections() }
                style={{width:30, paddingTop: 15}}
                title="Submit"
                accessibilityLabel="Submit"
              />
            </View>
          </View>
        </View>
        <View style ={{flex:1, position: 'absolute',left: 0, top: 75, bottom: 0, right: 0}}>
          <SectionList
            sections={this.state.locations}
            renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
            renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
            keyExtractor={(item, index) => index}
          />
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
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default LocationList;
