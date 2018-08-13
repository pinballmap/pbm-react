import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons';

class LocationCard extends Component {
  render(){
    const numMachines = this.props.machines.length
    const machineList = numMachines <= 5 ? this.props.machines.join(', ') : `${this.props.machines.slice(0, 5).join(', ')}. Plus ${numMachines - 5} more!`

    return(
        <Card style={{flex: 1}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'space-around'}}>
            <View>
              <Text style={s.locationName}>{this.props.name}</Text>
              <Text numberOfLines={1} ellipsizeMode={'tail'}>{`${this.props.street}, ${this.props.state} ${this.props.zip}`}</Text>
              {this.props.type && <Text>{this.props.type}</Text>}
              <Text>{this.props.distance.toFixed(2)} mi</Text>
              <Text>{machineList}</Text>
            </View>
            <Ionicons name="ios-arrow-dropright" size={24} onPress={() => this.props.navigation.navigate('LocationDetails', {id: this.props.id, locationName: this.props.name})}/>
          </View>
        </Card>
    );
  }
}

const s = StyleSheet.create({
  locationName: {
    fontWeight: 'bold'
  }
});

export default LocationCard;
