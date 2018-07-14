import "../config/globals.js"
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { ButtonGroup } from 'react-native-elements'
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
      isLoading: true,
      buttonIndex: 0,
      locations: [],
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} title="Map" />,
      title: 'LocationList',
    };
  };


  updateIndex = (buttonIndex) => {
    this.setState({ buttonIndex })
    switch(buttonIndex) {
      case 0:
        return this.setState({
          locations: this.state.locations.sort((a, b) => a.distance > b.distance)
        })
      case 1:
        return this.setState({
          locations: this.state.locations.sort((a, b) => a.name > b.name)
        })
      case 2:
        return this.setState({
          locations: this.state.locations.sort((a, b) => a.updatedAt > b.updatedAt)
        })
    }
  }


  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          lat: Number(position.coords.latitude),
          lon: Number(position.coords.longitude),
          error: null,
        });

        const url = this.state.address != '' ?
        '/locations/closest_by_address.json?address=' + this.state.address + ';send_all_within_distance=1;max_distance=5' :
        '/locations/closest_by_lat_lon.json?lat=' + this.state.lat + ';lon=' + this.state.lon + ';send_all_within_distance=1;max_distance=5';
  
        getData(url)
          .then(data => {
            this.setState({
              isLoading: false,
              locations: data.locations,
            })
          })
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
        <Text>SORT BY:</Text>
        <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={this.state.buttonIndex}
            buttons={['Distance', 'Alphabetically', 'Last Updated']}
            containerStyle={{ height: 30 }}
        />
        <View style={{ flex: 1, position: 'absolute', left: 0, top: 75, bottom: 0, right: 0 }}>
          <FlatList
            data={this.state.locations}
            extraData={this.state}
            renderItem={({ item }) =>
              <LocationCard
                name={item.name}
                distance={item.distance}
                street={item.street}
                state={item.state}
                zip={item.zip}
                machines={item.machine_names} 
                type={item.location_type_id ? this.state.locationTypes.find(location => location.id === item.location_type_id).name : ""}
                navigation={this.props.navigation}
                id={item.id} />
            }
            keyExtractor={(item, index) => `list-item-${index}`}
          />
        </View>
      </View>
    );
  }
}

export default LocationList;
