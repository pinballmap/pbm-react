import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import { HeaderBackButton } from 'react-navigation'

class Podcast extends Component {
  
  static navigationOptions = ({ navigation }) => {
      return {
          headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} title="Map" />,
          title: 'Podcast',
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
export default connect(mapStateToProps)(Podcast)
