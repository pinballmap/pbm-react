import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Text, View, StyleSheet } from 'react-native'
import { HeaderBackButton } from 'react-navigation'
import { MaterialIcons } from '@expo/vector-icons'


class Events extends Component {
  
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'Events',
            drawerIcon: ({tintColor}) => (
                <MaterialIcons name='event-note' style={[s.drawerIcon]} />
            ),
            headerLeft: <HeaderBackButton tintColor="#4b5862" onPress={() => navigation.goBack(null)} />,
            title: 'Events',
            headerStyle: {
                backgroundColor:'#f5fbff',               
            },
            headerTintColor: '#4b5862'
        }
    }
     
    render(){
        return(
            <View style={{marginTop: 300, flex: 1,backgroundColor:'#f5fbff'}}>
                <Button
                    onPress={ () => this.props.navigation.navigate('Map') }
                    style={{width:30, paddingTop: 15}}
                    title="Back to Map"
                />
                <Text>Events</Text>
            </View>)
    }
}

const s = StyleSheet.create({ 
    drawerIcon: {
        fontSize: 24,
        color: '#6a7d8a'
    },
})

Events.propTypes = {
    navigation: PropTypes.object,
}

export default Events