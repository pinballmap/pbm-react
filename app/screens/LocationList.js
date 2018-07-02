import "../config/globals.js"
import React, { Component } from 'react';
import { ActivityIndicator, Button, FlatList, TextInput, View } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { LocationCard } from '../components';
import { retrieveItem } from '../config/utils';

import { getData } from '../config/request'

class LocationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

  componentDidMount() {
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

    retrieveItem('locationTypes').then((locationTypes) => {
      this.setState({ locationTypes })
      }).catch((error) => {
      console.log('Promise is rejected with error: ' + error);
      }); 
  }

  reloadSections() {
    var url = this.state.address != '' ?
      '/locations/closest_by_address.json?address=' + this.state.address + ';send_all_within_distance=1;max_distance=5' :
      '/locations/closest_by_lat_lon.json?lat=' + this.state.lat + ';lon=' + this.state.lon + ';send_all_within_distance=1;max_distance=5';

    getData(url)
      .then(data => {
        this.setState({
          isLoading: false,
          locations: data.locations,
        })
      })
  }

  render() {
    if (this.state.isLoading || !this.state.locationTypes) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      )
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <TextInput
              onChangeText={address => this.setState({ address })}
              style={{ width: 200, height: 40, borderColor: 'gray', borderWidth: 1 }}
              value={this.state.address}
            />
          </View>
          <View>
            <Button
              onPress={() => this.reloadSections()}
              style={{ width: 30, paddingTop: 15 }}
              title="Submit"
              accessibilityLabel="Submit"
            />
          </View>
        </View>
        <View style={{ flex: 1, position: 'absolute', left: 0, top: 75, bottom: 0, right: 0 }}>
          <FlatList
            data={this.state.locations}
            renderItem={({ item }) =>
              <LocationCard
                name={item.name}
                distance={item.distance}
                street={item.street}
                state={item.state}
                zip={item.zip}
                machines={item.machine_names} 
                type={item.location_type_id ? this.state.locationTypes.find(location => location.id === item.location_type_id).name : ""}/>
            }
            keyExtractor={(item, index) => `list-item-${index}`}
          />
        </View>
      </View>
    );
  }
}

export default LocationList;
