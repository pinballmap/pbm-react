import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
    Button,
    StyleSheet, 
    Text, 
    View, 
} from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { 
    getStatusBarHeight,
    ifIphoneX,
} from 'react-native-iphone-x-helper'
import { HeaderBackButton } from '../components'

class Contact extends Component {
  
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'Contact',
            drawerIcon: ({tintColor}) => (
                <MaterialCommunityIcons name='email-outline' style={[s.drawerIcon]} />
            ), 
            headerLeft: <HeaderBackButton navigation={navigation}/>,
            title: 'Contact',
            headerStyle: {
                backgroundColor:'#f5fbff',
                ...ifIphoneX({
                    height: getStatusBarHeight() + 30,
                    paddingTop: getStatusBarHeight()
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