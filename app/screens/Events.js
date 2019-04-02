import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
    Button, 
    StyleSheet,
    Text, 
    View, 
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { HeaderBackButton } from '../components'

class Events extends Component {
  
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'Events',
            drawerIcon: ({tintColor}) => (
                <MaterialIcons name='event-note' style={[s.drawerIcon]} />
            ),
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: 'Events',
            headerStyle: {
                backgroundColor:'#f5fbff',
                ...ifIphoneX({
                    paddingTop: 30,
                    height: 60
                }, {
                    paddingTop: 0
                })               
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