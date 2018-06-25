import React, { Component } from 'react';
import { Text } from 'react-native';
import { Card } from 'react-native-elements'

class LocationCard extends Component {
  render(){
    const machineList = this.props.machines.join(' , ')
    machineList.slice(0, -2)
    
    return(
        <Card style={{flex: 1}}>
            <Text>{this.props.name}</Text>
            <Text numberOfLines={1} ellipsizeMode={'tail'}>{`${this.props.street}, ${this.props.state} ${this.props.zip}`}</Text>
            <Text>{this.props.distance.toFixed(2)} mi</Text>
            <Text>{machineList}</Text>
        </Card>
    );
  }
}

export default LocationCard;
