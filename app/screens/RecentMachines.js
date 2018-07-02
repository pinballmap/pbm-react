import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, Text, View } from 'react-native';
import { retrieveItem } from '../config/utils'

class RecentMachines extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      machines: []
    }
  }

  componentDidMount() {
    retrieveItem('machines').then((machines) => {
      this.setState({ machines })
      }).catch((error) => {
      console.log('Promise is rejected with error: ' + error);
      }); 
  }
  render(){
    if (!this.state.machines) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      )
    }

    return(
      <View>
        <Text>MACHINES</Text>
        {this.state.machines.map(machine => <Text key={machine.id}>{machine.name}</Text>)}
      </View>);
  }
}

export default RecentMachines;
