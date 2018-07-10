import React, { Component } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, ButtonGroup, ListItem } from 'react-native-elements'
import { retrieveItem } from '../config/utils';

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
            this.setState({
                locationDetailsLoading: false,
                location: data,
            })
        })
        
        getData(`/locations/${this.state.id}/machine_details.json`)
        .then(data => {
            this.setState({
                machineDetailsLoading: false,
                machines: data.machines,
            })
        })
        
        
        retrieveItem('locationTypes').then((locationTypes) => {
            this.setState({ locationTypes })
        }).catch((error) => console.log('Promise is rejected with error: ' + error)); 

        retrieveItem('auth').then((auth) => {
            this.setState({ auth })
        }).catch((error) => console.log('Promise is rejected with error: ' + error)); 
    }

    render() {
        if (this.state.locationDetailsLoading || this.state.machineDetailsLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }

        const machines = this.state.machines
        const location = this.state.location

        return (
            <View style={{ flex: 1 }}>
                <MapView
                    region={{
                        latitude: Number(location.lat),
                        longitude: Number(location.lon),
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.03
                    }}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                >
                    <MapView.Marker
                        coordinate={{
                            latitude: Number(location.lat),
                            longitude: Number(location.lon),
                            latitudeDelta: 0.03,
                            longitudeDelta: 0.03,
                        }}
                    />
                </MapView>
                <View style={{ flex: 3 }}>
                    <ButtonGroup
                        onPress={this.updateIndex}
                        selectedIndex={this.state.buttonIndex}
                        buttons={['Machines', 'Info']}
                        containerStyle={{ height: 30 }}
                    />
                    {this.state.buttonIndex === 0 ?
                        <View>
                        {this.state.auth && 
                            <Button
                                onPress={() => console.log(this.state.auth.authentication_token, this.state.auth.email)}
                                title={'Add Machine'}
                            />
                        }
                        {
                            machines.map(machine => (
                                <ListItem   
                                    key={machine.id}
                                    title={machine.name}
                                />
                            ))
                        }
                        </View> :
                        <View>
                            <Text>{location.street}</Text>
                            <Text>{location.city}</Text>
                            <Text>{location.phone}</Text>
                            {location.website && <Text 
                                style={{color: 'blue'}}
                                onPress={() => Linking.openURL(location.website)}
                            >Website</Text>}
                            {location.location_type_id && <Text>{this.state.locationTypes.find(type => type.id === location.location_type_id).name}</Text>}
                        </View>
                       
                    }
                </View>
            </View>
        )


    }
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
});

export default LocationDetails;
