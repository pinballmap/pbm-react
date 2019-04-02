import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, ScrollView, Image, Linking, View, Dimensions } from 'react-native'
import { 
    HeaderBackButton,
    Text 
} from '../components'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ifIphoneX } from 'react-native-iphone-x-helper'

let deviceWidth = Dimensions.get('window').width

class Podcast extends Component {
     
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'Podcast',
            drawerIcon: ({tintColor}) => (
                <MaterialCommunityIcons name='radio-tower' style={[s.drawerIcon]} />
            ), 
            headerLeft: <HeaderBackButton navigation={navigation}/>,
            title: 'Podcast',
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
            <ScrollView style={{flex:1,backgroundColor:'#f5fbff'}}>
                <View style={s.container}>
                    <View style={[s.logoWrapper,s.child]}>
                        <Image source={require('../assets/images/mappin-logo-600.png')} style={s.logo}/>
                    </View>
                    <View style={s.child}>
                        <Text style={s.text}>In Summer 2018 we started a podcast, <Text style={s.bold}>Mappin’ Around w/ Scott and Ryan</Text>! We talk about site news, site tech, stats, and we interview operators and friends. We release a new episode once a month. Check it out!</Text>
                        <Text style={s.textLink}
                            onPress={() => Linking.openURL('http://pod.pinballmap.com')}
                        >pod.pinballmap.com</Text>
                    </View>  
                </View>
            </ScrollView>
        )
    }
}

const s = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        flex: 1,
    },
    logoWrapper: {
        padding: 5,
        flex: 2
    },
    logo: {
        width: deviceWidth - 20,
        height: deviceWidth - 20,
        justifyContent: 'center',
    },
    child: {
        margin: "auto",
        padding: 10,
    },
    text: {
        fontSize: 16
    },
    bold: {
        fontWeight: 'bold',
    },
    textLink: {
        textDecorationLine: 'underline',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 5,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#D3ECFF",
        fontWeight: 'bold'
    },
    drawerIcon: {
        fontSize: 24,
        color: '#6a7d8a'
    },
})

Podcast.propTypes = {
    navigation: PropTypes.object,
}

export default Podcast
