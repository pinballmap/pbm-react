import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { FontAwesome, EvilIcons, MaterialIcons } from '@expo/vector-icons';

import FilterMap from '../screens/FilterMap.js';
import LocationList from '../screens/LocationList.js';
import LocationDetails from '../screens/LocationDetails.js';
import Login from '../screens/Login.js';
import Map from '../screens/Map.js';
import RecentActivity from '../screens/RecentActivity.js';
import RecentMachines from '../screens/RecentMachines.js';
import Signup from '../screens/Signup.js';
import SignupLogin from '../screens/SignupLogin.js';
import UserProfile from '../screens/UserProfile.js';

export const PbmTab =
TabNavigator({
  LocationList: {
    screen: LocationList
  },
  SignupLogin: {
    screen: SignupLogin
  },
  Signup: {
    screen: Signup
  }
}, {
  tabBarPosition: 'bottom',
   swipeEnabled: true,
     tabBarOptions: {
     activeTintColor: '#f2f2f2',
     activeBackgroundColor: '#2EC4B6',
     inactiveTintColor: '#666',
     labelStyle: {
       fontSize: 22,
       padding: 12
     }
   }
});

export const PbmStack = StackNavigator({
  SignupLogin: {
    screen: SignupLogin,
    navigationOptions: {
      headerLeft: null
    },
  },
  Map: {
    screen: TabNavigator({
      Map: { screen: Map },
      RecentMachines: { screen: RecentMachines },
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
              return <MaterialIcons name='menu' size={25} />
            case 'RecentMachines':
              return <MaterialIcons name='menu' size={25} />
            case 'Activity':
              return <FontAwesome name='newspaper-o' size={25} />
            case 'Profile':
              return <EvilIcons name='user' size={25} />
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
    navigationOptions: {
      headerLeft: null
    },
  },
  Login: {
    screen: Login,
    navigationOptions: {
      headerLeft: null
    },
  },
  FilterMap: {
    screen: FilterMap,
  },
});
