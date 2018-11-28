import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, View, StyleSheet, TouchableOpacity, Platform } from 'react-native'
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
                        <View style={{width: '100%',zIndex: 10}}>
                            <View style={s.locationNameContainer}>
                                <Text style={s.locationName}>{this.props.name}</Text>
                            </View>
                            <Text style={[s.gray,s.marginS]} numberOfLines={1} ellipsizeMode={'tail'}>{`${this.props.street}, ${this.props.state} ${this.props.zip}`}</Text>
                            {this.props.type ? <Text style={[s.gray,s.italic,s.marginS]}>({this.props.type})</Text> : null}
                            <Text style={[s.gray,s.marginS]}>{this.props.distance.toFixed(2)} miles away</Text>
                            <View style={s.margin}>
                                {this.props.machines.slice(0, NUM_MACHINES_TO_SHOW).map(m => {
                                    const idx = typeof m === 'string' ? m.lastIndexOf('(') : -1
                                    const title = typeof m === 'string' ? m.slice(0, idx) : m.name
                                    const info = typeof m === 'string' ? m.slice(idx) : ` (${m.manufacturer}, ${m.year})`
                                    const key = typeof m === 'string' ? m : `${m.name}-${m.manufacturer}-${m.year}`
                                    return (
                                        <Text key={key} style={s.mName}>
                                            <Text style={{fontWeight: 'bold',fontSize: 15}}>{title}</Text>
                                            <Text>{`${info}\n`}</Text>
                                        </Text>
                                    )})
                                }
                                {numMachines > NUM_MACHINES_TO_SHOW ? <Text style={[{marginBottom:10},s.italic]}>{`Plus ${numMachines - NUM_MACHINES_TO_SHOW} more!`}</Text> : null}
                            </View>
                        </View>
                        <Ionicons style={s.iconStyle} name="ios-arrow-dropright-circle"/>
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
    mName: {
        marginBottom: Platform.OS === 'ios' ? -10 : 0,
    },
    locationNameContainer: {
        width: '100%',
        backgroundColor: "#D3ECFF",
        marginBottom: 5,
        padding: 5,
    },
    locationName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: "#260204"
    },
    margin: {
        marginTop: 5,
        marginLeft: 5,
    },
    marginS: {
        marginTop: 3,
        marginLeft: 5
    },
    gray: {
        color: "#444444",
    },
    italic: {
        fontStyle: 'italic',
    },
    iconStyle: {
        fontSize: 32,
        color: '#eeeeee',
        marginRight: 0,
        position: "absolute",
        right: 0,
        zIndex: 5
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
