import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

class MainMenu extends Component {
  render() {
    return (
      <View>
        <Text>PBM React Native App</Text>
        <Button
          onPress={() => this.props.navigation.navigate('EnableLocationServices')}
          title="Enable Location Services"
        />
        <Button
          onPress={() => this.props.navigation.navigate('Map')}
          title="Look at the map"
        />
        <Button
          onPress={() => this.props.navigation.navigate('LocationList')}
          title="Look at the List View"
        />
        <Button
          onPress={() => this.props.navigation.navigate('SignupLogin')}
          title="Signup / Login"
        />
        <Button
          onPress={() => this.props.navigation.navigate('Signup')}
          title="Signup"
        />
        <Button
          onPress={() => this.props.navigation.navigate('Login')}
          title="Login"
        />
      </View>
    );
  }
}

export default MainMenu;
