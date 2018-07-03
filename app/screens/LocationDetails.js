import React, { Component } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { ButtonGroup } from 'react-native-elements'

import { getData } from '../config/request'

class LocationDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.navigation.state.params['id'],
            locationDetailsLoading: true,
            machineDetailsLoading: true,
            buttonIndex: 0,
            location: {},
            machines: []
        }
    }

    updateIndex = (buttonIndex) => {
        this.setState({ buttonIndex })
    }

    componentDidMount() {
        getData(`/locations/${this.state.id}.json`)
            .then(data => {
                console.log(data)
                this.setState({
                    locationDetailsLoading: false,
                    location: data,
                })

            })
        getData(`/locations/${this.state.id}/machine_details.json`)
        .then(data => {
            console.log(data)
            this.setState({
                machineDetailsLoading: false,
                machines: data.machines,
            })
      
            
        })
    }

    render() {
        if (this.state.locationDetailsLoading || this.state.machineDetailsLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }

        return (
            <View style={{ flex: 1 }}>
                <ButtonGroup
                    onPress={this.updateIndex}
                    selectedIndex={this.state.buttonIndex}
                    buttons={['Machines', 'Info']}
                    selectedBackgroundColor='pink'
                    containerStyle={{height: 30}}
                />
                {this.state.buttonIndex === 0 ? 
                    this.state.machines.map(machine => <Text key={machine.id}>{machine.name}</Text>) :
                    <Text>{this.state.location.city}</Text> 
                }
            </View>
        )


    }
}

export default LocationDetails;
