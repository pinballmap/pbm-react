import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Text, View } from 'react-native'

class About extends Component {
  
  static navigationOptions = { drawerLabel: 'About' }
     
  render(){
      return(
          <View style={{marginTop: 300, flex: 1}}>
              <Button
                  onPress={ () => this.props.navigation.navigate('Map') }
                  style={{width:30, paddingTop: 15}}
                  title="Back to Map"
              />
              <Text>About</Text>
          </View>)
  }
}

About.propTypes = {
    navigation: PropTypes.object,
}

export default About