import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons';

class LocationCard extends Component {
  render(){
    const numMachines = this.props.machines.length
    const machineList = numMachines <= 5 ? this.props.machines.join('\n') : `${this.props.machines.slice(0, 5).join('\n')} \nPlus ${numMachines - 5} more!`

    return(
        <Card style={{flex: 1}}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('LocationDetails', {id: this.props.id, locationName: this.props.name})}>
            <View style={s.flexi}>
              <View style={{width: '95%'}}>
                <View style={s.locationNameContainer}>
                  <Text style={s.locationName}>{this.props.name}</Text>
                </View>
                <Text numberOfLines={1} ellipsizeMode={'tail'}>{`${this.props.street}, ${this.props.state} ${this.props.zip}`}</Text>
                {this.props.type && <Text>Location Type: {this.props.type}</Text>}
                <Text style={s.margin}>Distance: {this.props.distance.toFixed(2)} mi</Text>
                <Text style={[s.margin, s.bold]}>{machineList}</Text>
              </View>
              <Ionicons style={s.iconStyle} name="ios-arrow-dropright"/>
            </View>
          </TouchableOpacity>
        </Card>
    );
  }
}

const s = StyleSheet.create({
  flexi: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    alignContent: 'space-around',
  },
  locationNameContainer: {
    width: '105%',
    backgroundColor: "#D3ECFF",
    marginBottom: 10,
    padding: 5,
  },
  locationName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  margin: {
    marginTop: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  iconStyle: {
    fontSize: 32,
    color: '#cccccc',
  },
});

export default LocationCard;
