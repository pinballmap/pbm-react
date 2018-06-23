import React, { Component } from 'react';
import { Text } from 'react-native';
import { Card } from 'react-native-elements'

class LocationCard extends Component {
  render(){
    return(
        <Card>
            <Text>{this.props.location}</Text>
        </Card>
    );
  }
}

export default LocationCard;
