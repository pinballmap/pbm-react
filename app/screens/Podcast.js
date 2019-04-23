import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
    Dimensions,
    Image, 
    Linking, 
    ScrollView,
    StyleSheet, 
    View,
} from 'react-native'
import { Button } from 'react-native-elements'
import { EvilIcons } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { 
    HeaderBackButton,
    Text 
} from '../components'
import { headerStyle } from '../styles'

let deviceWidth = Dimensions.get('window').width

class Podcast extends Component {
     
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'Podcast',
            drawerIcon: () => <MaterialCommunityIcons name='radio-tower' style={[s.drawerIcon]} />, 
            headerLeft: <HeaderBackButton navigation={navigation}/>,
            title: 'Podcast',
            headerRight:<View style={{padding:6}}></View>,
            headerTitleStyle: {
                textAlign: 'center',
                flexGrow: 1,
                alignSelf:'center',
            },
            headerStyle,
            headerTintColor: '#4b5862'
        }
    }

    render(){
        return(
            <ScrollView style={{flex:1,backgroundColor:'#f5fbff'}}>
                <View style={s.container}>
                    <View style={[s.logoWrapper]}>
                        <Image source={require('../assets/images/mappin-logo-600.png')} style={s.logo}/>
                    </View>
                    <View style={s.child}>
                        <Text style={s.text}>In Summer 2018 we started a podcast, <Text style={s.bold}>Mappin’ Around w/ Scott and Ryan</Text>! We talk about site news, site tech, stats, and we interview operators and friends. We release a new episode about once a month. Check it out!</Text>
                        <Button
                            title={'pod.pinballmap.com'}
                            onPress={() => Linking.openURL('http://pod.pinballmap.com')}
                            buttonStyle={s.externalLink}
                            titleStyle={{
                                color:"#000e18", 
                                fontSize:16
                            }}
                            iconRight
                            icon={<EvilIcons name='external-link' style={s.externalIcon} />}
                            containerStyle={s.margin15}
                        />
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
        flex: 2,
        margin: "auto",
        paddingTop: 10,
        paddingHorizontal: 10
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
        fontSize: 16,
        lineHeight: 22
    },
    bold: {
        fontWeight: 'bold',
    },
    externalLink: {
        backgroundColor:'#ffffff',
        borderWidth: 1,
        borderColor: '#97a5af',
        borderRadius: 50,
        elevation: 0
    },
    externalIcon: {
        fontSize: 24
    },
    margin15: {
        marginLeft:15,
        marginRight:15,
        marginTop:15,
        marginBottom:15
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
