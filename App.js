import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

import LocationList from './LocationList.js';
import Login from './Login.js';
import Map from './Map.js';
import Signup from './Signup.js';
import SignupLogin from './SignupLogin.js';

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
        <Button
          onPress={() => navigate('SignupLogin')}
          title="Signup / Login"
        />
        <Button
          onPress={() => navigate('Signup')}
          title="Signup"
        />
        <Button
          onPress={() => navigate('Login')}
          title="Login"
        />
      </View>
    );
  }
}

const SimpleApp = StackNavigator({
  Home: { screen: Pbm },
  Map: { screen: Map },
  LocationList: { screen: LocationList },
  SignupLogin: { screen: SignupLogin },
  Signup: { screen: Signup },
  Login: { screen: Login },
});

export default SimpleApp;
