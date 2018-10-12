import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import { HeaderBackButton } from 'react-navigation'

class RecentMachines extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            machines: this.props.machines.machines
        }
    }
  
  static navigationOptions = ({ navigation }) => {
      return {
          headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} title="Map" />,
          title: 'Saved',
      }
  };

  // I just copied the recentmachines screen code as a placeholder. 
  // But this screen should be like LocationList, but only showing SAVED locations.
  render(){
      return(
          <View>
              <Text>Saved</Text>
              {this.state.machines.map(machine => <Text key={machine.id}>{machine.name}</Text>)}
          </View>)
  }
}

RecentMachines.propTypes = {
    machines: PropTypes.object,
}

const mapStateToProps = ({ machines }) => ({ machines })
export default connect(mapStateToProps)(RecentMachines)
