import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Text, View, StyleSheet } from 'react-native'
import { HeaderBackButton } from 'react-navigation'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { ifIphoneX } from 'react-native-iphone-x-helper'

class Contact extends Component {
  
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'Contact',
            drawerIcon: ({tintColor}) => (
                <MaterialCommunityIcons name='email-outline' style={[s.drawerIcon]} />
            ), 
            headerLeft: <HeaderBackButton tintColor="#4b5862" onPress={() => navigation.goBack(null)} />,
            title: 'Contact',
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
                <Text>Contact</Text>
            </View>)
    }
}

const s = StyleSheet.create({ 
    drawerIcon: {
        fontSize: 24,
        color: '#6a7d8a'
    },
})

Contact.propTypes = {
    navigation: PropTypes.object,
}

export default Contact