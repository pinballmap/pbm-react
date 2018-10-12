import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import { HeaderBackButton } from 'react-navigation'

class FAQ extends Component {
  
  static navigationOptions = ({ navigation }) => {
      return {
          headerLeft: <HeaderBackButton tintColor="#888888" onPress={() => navigation.goBack(null)} title="Map" />,
          title: 'FAQ',
      }
  };

  render(){
      return(
          <View>
              <Text>placeholder</Text>
          </View>)
  }
}

const mapStateToProps = ({ machines }) => ({ machines })
export default connect(mapStateToProps)(FAQ)
