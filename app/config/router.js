import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { FontAwesome, MaterialIcons,MaterialCommunityIcons } from '@expo/vector-icons';

import FilterMap from '../screens/FilterMap.js';
import LocationList from '../screens/LocationList.js';
import LocationDetails from '../screens/LocationDetails.js';
import Login from '../screens/Login.js';
import Map from '../screens/Map.js';
import RecentActivity from '../screens/RecentActivity.js';
import Saved from '../screens/Saved.js';
import Signup from '../screens/Signup.js';
import SignupLogin from '../screens/SignupLogin.js';
import UserProfile from '../screens/UserProfile.js';
import MachineDetails from '../screens/MachineDetails.js';
import AddMachine from '../screens/AddMachine.js';

export const PbmStack = StackNavigator({
  Map: {
    screen: TabNavigator({
      Map: { screen: Map },
      Saved: { screen: Saved },
      Activity: { screen: RecentActivity },
      Profile: { screen: UserProfile },
    },
    {
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: () => {
          const { routeName } = navigation.state
          let iconName;
          switch(routeName) {
            case 'Map':
              return <MaterialIcons name='search' size={25} />
            case 'Saved':
              return <MaterialCommunityIcons name='star-outline' size={25} />
            case 'Activity':
              return <FontAwesome name='newspaper-o' size={25} />
            case 'Profile':
              return <MaterialIcons name='face' size={25} />
          }
        }
      })
    },
    {
      tabBarPosition: 'bottom',
      swipeEnabled: true,
      tabBarOptions: {
        activeTintColor: '#f2f2f2',
        activeBackgroundColor: '#2EC4B6',
        inactiveTintColor: '#666',
      }
    })
  },
  SignupLogin: {
    screen: SignupLogin,
  },
  LocationList: {
    screen: LocationList,
    navigationOptions: {
      title: 'Location List',
    },
  },
  LocationDetails: {
    screen: LocationDetails,
  },
  Signup: {
    screen: Signup,
  },
  Login: {
    screen: Login,
  },
  FilterMap: {
    screen: FilterMap,
  },
  MachineDetails: {
    screen: MachineDetails,
  },
  AddMachine: {
    screen: AddMachine,
  }
});
