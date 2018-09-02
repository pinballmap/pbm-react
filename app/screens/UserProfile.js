import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { HeaderBackButton } from 'react-navigation';

class UserProfile extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} title="Map" />,
      title: 'Profile',
    };
  };
  
  render(){
    return(<View><Text>UserProfile Screen</Text></View>);
  }
}

export default UserProfile;
