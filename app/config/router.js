import React from 'react';
import { StackNavigator } from 'react-navigation';

import EnableLocationServices from '../screens/EnableLocationServices.js';
import LocationList from '../screens/LocationList.js';
import Login from '../screens/Login.js';
import Map from '../screens/Map.js';
import MainMenu from '../screens/MainMenu.js';
import Signup from '../screens/Signup.js';
import SignupLogin from '../screens/SignupLogin.js';

export const PbmStack = StackNavigator({
  MainMenu: {
    screen: MainMenu,
    navigationOptions: {
      title: 'Main Menu',
    },
  },
  EnableLocationServices: {
    screen: EnableLocationServices,
    navigationOptions: {
      title: 'Enable Location Services',
    },
  },
  Map: {
    screen: Map,
    navigationOptions: {
      title: 'Map',
    },
  },
  LocationList: {
    screen: LocationList,
    navigationOptions: {
      title: 'Location List',
    },
  },
  SignupLogin: {
    screen: SignupLogin,
    navigationOptions: {
      title: 'Signup / Login',
    },
  },
  Signup: {
    screen: Signup,
    navigationOptions: {
      title: 'Signup',
    },
  },
  Login: {
    screen: Login,
    navigationOptions: {
      title: 'Login',
    },
  },
});
