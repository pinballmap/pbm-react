import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import LocationList from './LocationList.js';
import Map from './Map.js';

class Pbm extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View>
        <Text>PBM React Native App</Text>
        <Button
          onPress={() => navigate('Map')}
          title="Look at the map"
        />
        <Button
          onPress={() => navigate('LocationList')}
          title="Look at the List View"
        />
      </View>
    );
  }
}

const SimpleApp = StackNavigator({
  Home: { screen: Pbm },
  Map: { screen: Map },
  LocationList: { screen: LocationList },
});

export default SimpleApp;
