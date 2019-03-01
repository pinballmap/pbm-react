import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { HeaderBackButton } from 'react-navigation'

class RecentActivity extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#4b5862" onPress={() => navigation.goBack(null)} />,
            title: 'Activity',
            headerStyle: {
                backgroundColor:'#f5fbff',          
            },
            headerTintColor: '#4b5862'
        }
    };

  render(){
      return(<View><Text>RecentActivity Screen</Text></View>)
  }
}

export default RecentActivity
