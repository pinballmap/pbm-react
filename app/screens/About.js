import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
    Dimensions,
    Image, 
    Linking, 
    StyleSheet, 
    ScrollView, 
    View, 
} from 'react-native'
import { getData } from '../config/request'
import { Text } from '../components'
import { MaterialIcons } from '@expo/vector-icons'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { HeaderBackButton } from '../components'

let deviceWidth = Dimensions.get('window').width

class About extends Component {
    state ={ 
        num_locations: 0, 
        num_lmxes: 0, 
        apiError: '',
    }

    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'About',
            drawerIcon: ({tintColor}) => (
                <MaterialIcons name='info-outline' style={[s.drawerIcon]} />
            ),
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: 'About',
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

    componentDidMount(){
        getData('/regions/location_and_machine_counts.json')
            .then(data => {
                if (data && data.num_lmxes && data.num_locations) {
                    this.setState({
                        num_lmxes: data.num_lmxes,
                        num_locations: data.num_locations,
                    })
                } else {
                    this.setState({
                        apiError: data
                    })
                }
            })
            .catch(apiError => this.setState({ apiError }))
    }
     
    render(){
        return(
            <ScrollView style={{flex:1,backgroundColor:'#f5fbff'}}>
                <View style={s.container}>
                    <View style={[s.logoWrapper,s.child]}>
                        <Image source={require('../assets/images/pinballmapcom_nocom.png')} resizeMode="contain" style={s.logo}/>
                    </View>
                    <View style={s.child}>
                        <Text style={s.text}>Pinball Map was founded in 2008. It is a crowdsourced map listing all the public pinball machines in North America and beyond.</Text>
                        <Text style={s.text}>We are currently listing {this.state.num_locations} locations and {this.state.num_lmxes} machines. You can update the map using this app or the website: <Text style={s.textLink} onPress={() => Linking.openURL('https://pinballmap.com')}>pinballmap.com</Text>.</Text>
                        <Text style={s.text}>We are currently supplying the mapping data for the <Text style={s.textLink} onPress={() => Linking.openURL('https://sternpinball.com/pinball-locator/')}>{'Stern Pinball website'}</Text>, as well as the <Text style={s.textLink} onPress={() => Linking.openURL('https://pindigo.app/')}>{'Pindigo app'}</Text>. We also collaborate with <Text style={s.textLink} onPress={() => Linking.openURL('http://pintips.net')}>{'PinTips'}</Text> and <Text style={s.textLink} onPress={() => Linking.openURL('http://matchplay.events')}>{'MatchPlay Events'}</Text>.</Text>
                        <Text style={s.text}><Text onPress={ () => this.props.navigation.navigate('Contact') } style={s.textLink}>{"Contact Us"}</Text>. <Text onPress={ () => this.props.navigation.navigate('Blog') } style={s.textLink}>{"Read the blog"}</Text>, or <Text onPress={ () => this.props.navigation.navigate('FAQ') } style={s.textLink}>{"read the FAQ"}</Text>.</Text>
                        <Text style={s.text}>Listen to our podcast, <Text style={s.textLink} onPress={() => Linking.openURL('http://pod.pinballmap.com')}>{`Mappin' Around with Scott & Ryan!`}</Text></Text>
                        <Text style={s.text}>Follow <Text style={s.textLink} onPress={() => Linking.openURL('https://twitter.com/pinballmapcom')}>@pinballmapcom</Text> on Twitter for updates and news!</Text>
                        <Text style={s.text}>Support us via the <Text style={s.textLink} onPress={() => Linking.openURL('https://patreon.com/pinballmap')}>Pinball Map Patreon</Text>.</Text>
                        <Text style={s.text}>We have a couple of <Text style={s.textLink} onPress={() => Linking.openURL('https://pinballmap.com/store')}>shirts for sale</Text>.</Text>
                        <Text style={s.text}>Want to collaborate on something? <Text style={s.textLink} onPress={() => Linking.openURL('https://pinballmap.com/api/v1/docs')}>We have an API</Text></Text>
                        <Text style={s.bold}>App Credits:</Text>
                        <Text style={s.textLink} onPress={() => Linking.openURL('https://github.com/bpoore')}>Beth Poore</Text>
                        <Text style={s.textLink} onPress={() => Linking.openURL('https://github.com/ryantg')}>Ryan Gratzer</Text>
                        <Text style={s.textLink} onPress={() => Linking.openURL('https://github.com/scottwainstock')}>Scott Wainstock</Text>
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
        flex:1,  
        width: deviceWidth - 20,  
    },
    child: {
        margin: "auto",
        padding: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 10
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10
    },
    textLink: {
        textDecorationLine: 'underline',
        color: "#F53240",
        fontSize: 16,
    },
    drawerIcon: {
        fontSize: 24,
        color: '#6a7d8a'
    },
})

About.propTypes = {
    navigation: PropTypes.object,
}

export default About