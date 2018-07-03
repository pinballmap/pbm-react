import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';

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
      Map: {
        screen: Map,
      },
      RecentMachines: {
        screen: RecentMachines,
        navigationOptions: {
          title: 'Recent',
          headerLeft: null
        },
      },
      RecentActivity: {
        screen: RecentActivity,
        navigationOptions: {
          title: 'Activity',
          headerLeft: null
        },
      },
      UserProfile: {
        screen: UserProfile,
        navigationOptions: {
          title: 'Profile',
          headerLeft: null
        },
      },
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
