import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { HeaderBackButton } from 'react-navigation'

class RecentActivity extends Component {
  static navigationOptions = ({ navigation }) => {
      return {
          headerLeft: <HeaderBackButton tintColor="#260204" onPress={() => navigation.goBack(null)} title="Map" />,
          title: 'Activity',
      }
  };

  render(){
      return(<View><Text>RecentActivity Screen</Text></View>)
  }
}

export default RecentActivity
