import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Card } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'

const NUM_MACHINES_TO_SHOW = 5

class LocationCard extends Component {
    render(){
        const numMachines = this.props.machines.length

        return(
            <Card>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('LocationDetails', {id: this.props.id, locationName: this.props.name})}>
                    <View style={s.flexi}>
                        <View style={{width: '95%'}}>
                            <View style={s.locationNameContainer}>
                                <Text style={s.locationName}>{this.props.name}</Text>
                            </View>
                            <Text numberOfLines={1} ellipsizeMode={'tail'}>{`${this.props.street}, ${this.props.state} ${this.props.zip}`}</Text>
                            {this.props.type && <Text style={[s.italic,s.margin]}>{this.props.type}</Text>}
                            <Text style={s.margin}>Distance: {this.props.distance.toFixed(2)} mi</Text>
                            <View style={s.margin}>
                                {this.props.machines.slice(0, NUM_MACHINES_TO_SHOW).map(m => {
                                    const idx = m.lastIndexOf('(')
                                    const title = m.slice(0, idx)
                                    const info = m.slice(idx)
                                    return (
                                        <Text key={m} style={{marginBottom:-10}}>
                                            <Text style={{fontWeight: 'bold'}}>{title}</Text>
                                            <Text>{`${info}\n`}</Text>
                                        </Text>
                                    )})
                                }
                                {numMachines > NUM_MACHINES_TO_SHOW && <Text style={[{marginBottom:10},s.italic]}>{`Plus ${numMachines - NUM_MACHINES_TO_SHOW} more!`}</Text>}
                            </View>
                        </View>
                        <Ionicons style={s.iconStyle} name="ios-arrow-dropright"/>
                    </View>
                </TouchableOpacity>
            </Card>
        )
    }
}

const s = StyleSheet.create({
    flexi: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        alignContent: 'space-around',
        marginBottom: -10
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
        marginTop: 5,
    },
    italic: {
        fontStyle: 'italic',
    },
    iconStyle: {
        fontSize: 32,
        color: '#cccccc',
    },
})

LocationCard.propTypes = {
    machines: PropTypes.array,
    type: PropTypes.string,
    zip: PropTypes.string,
    state: PropTypes.string,
    distance: PropTypes.number,
    name: PropTypes.string,
    id: PropTypes.number,
    street: PropTypes.string,
    navigation: PropTypes.object,
}

export default LocationCard
