import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import { HeaderBackButton } from 'react-navigation'

class SavedLocations extends Component {
  
  static navigationOptions = ({ navigation }) => {
      return {
          headerLeft: <HeaderBackButton tintColor="#00487e" onPress={() => navigation.goBack(null)} title="Map" />,
          title: 'Saved',
      }
  };

  // I just copied the recentmachines screen code as a placeholder. 
  // But this screen should be like LocationList, but only showing SAVED locations.
  render(){
      return(
          <View>
              <Text>Saved</Text>
          </View>)
  }
}

const mapStateToProps = ({ machines }) => ({ machines })
export default connect(mapStateToProps)(SavedLocations)
