import "../config/globals.js"
import React, { Component } from 'react';
import { ActivityIndicator, Button, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { HeaderBackButton } from 'react-navigation';

class LocationList extends Component {
  constructor(props){
    super(props);

    this.mapRef = null;
    this.state ={ lat: null, lon: null, address: '', isLoading: true}
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} title="Map" />,
      title: 'LocationList',
    };
  };
  
  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          lat: Number(position.coords.latitude),
          lon: Number(position.coords.longitude),
          error: null,
        });

        this.reloadSections();
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  async reloadSections() {
    var url = this.state.address != '' ?
      global.api_url + '/locations/closest_by_address.json?address=' + this.state.address + ';send_all_within_distance=1;max_distance=5' :
      global.api_url + '/locations/closest_by_lat_lon.json?lat=' + this.state.lat + ';lon=' + this.state.lon + ';send_all_within_distance=1;max_distance=5'
    ;

    const response = await fetch(url)
    const responseJson = await response.json();
     
    let locations = {};
    let locationDict = {};

    for (var i in responseJson.locations) {
      var location = responseJson.locations[i];
      var firstCharacter = location.name.charAt(0).toUpperCase();

      if (!(firstCharacter in locationDict)) {
        locationDict[firstCharacter] = []
      }

      locationDict[firstCharacter].push(location.name);
    }

    locations = Object.keys(locationDict).map((key) => (
      {title: key, data: locationDict[key]}
    ));

    locations.sort((a, b) => a.title > b.title);

    this.setState({
      isLoading: false,
      locations: locations,
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
        <View style={{paddingTop:20}}>
          <Text>PINBALL MAP</Text>
          <View style={{flexDirection: 'row'}}>
            <View>
              <TextInput
                onChangeText={address => this.setState({address})}
                style={{width:200, height: 40, borderColor: 'gray', borderWidth: 1}}
                value={this.state.address}
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
