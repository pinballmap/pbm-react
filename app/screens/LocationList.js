import "../config/globals.js"
import React, { Component } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, TextInput, View } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { LocationCard } from '../components'

class LocationList extends Component {
  constructor(props){
    super(props);

    this.state ={ 
      lat: null, 
      lon: null, 
      address: '', 
      isLoading: true
    };
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
    
    this.setState({
      isLoading: false,
      locations: responseJson.locations,
    })
  }

  render(){
    if (this.state.isLoading) {
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={{flex: 1}}>
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
        <View style ={{flex:1, position: 'absolute',left: 0, top: 75, bottom: 0, right: 0}}>
          <FlatList
            data={this.state.locations}
            renderItem={({item}) => 
              <LocationCard  
                name={item.name}
                distance={item.distance}
                street={item.street}
                state={item.state}
                zip={item.zip}
                machines={item.machine_names} />
            }
            keyExtractor={(item, index) => `list-item-${index}`}
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
