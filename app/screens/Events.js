import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Text, View } from 'react-native'

class SuggestLocation extends Component {
  
  static navigationOptions = { drawerLabel: 'Events' }
     
  render(){
      return(
          <View style={{marginTop: 300, flex: 1}}>
              <Button
                  onPress={ () => this.props.navigation.navigate('Map') }
                  style={{width:30, paddingTop: 15}}
                  title="Back to Map"
              />
              <Text>Events</Text>
          </View>)
  }
}

SuggestLocation.propTypes = {
    navigation: PropTypes.object,
}

export default SuggestLocation