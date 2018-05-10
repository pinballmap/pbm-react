import React, { Component } from 'react';
import { Button, Text, View, YellowBox } from 'react-native';

class EnableLocationServices extends Component {
  enableGeolocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {},
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  render() {
    return (
      <View>
        <Text>To show you pinball machines near you, you’ll need to enable location services for this app</Text>
        <Button
          onPress={ () => this.enableGeolocation() }
          title="Enable Location"
        />
        <Text>I'LL DO THIS LATER</Text>
      </View>
    );
  }
}

export default EnableLocationServices;
