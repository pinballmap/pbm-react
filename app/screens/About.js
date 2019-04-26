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
import { HeaderBackButton } from '../components'
import {
    headerStyle,
    headerTitleStyle,
} from '../styles'

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
            drawerIcon: () => <MaterialIcons name='info-outline' style={[s.drawerIcon]} />,
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: 'About',
            headerRight:<View style={{padding:6}}></View>,
            headerTitleStyle,
            headerStyle,
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
                    <View style={[s.logoWrapper]}>
                        <Image source={require('../assets/images/pinballmapcom_nocom.png')} resizeMode="contain" style={s.logo}/>
                    </View>
                    <View style={s.child}>
                        <Text style={s.text}>Pinball Map was founded in 2008, and is a crowdsourced map listing the public pinball machines in... wherever!</Text>
                        <Text style={s.text}>We currently have {this.state.num_locations} locations and {this.state.num_lmxes} machines listed. You can update the map using this app or the website: <Text style={s.textLink} onPress={() => Linking.openURL('https://pinballmap.com')}>pinballmap.com</Text>. The data is managed by over 100 administrators and thousands of active users.</Text>
                        <Text style={s.text}>We are supply the mapping data for the <Text style={s.textLink} onPress={() => Linking.openURL('https://sternpinball.com/pinball-locator/')}>{`Stern Pinball website`}</Text>, as well as the <Text style={s.textLink} onPress={() => Linking.openURL('https://pindigo.app/')}>{`Pindigo app`}</Text>. We also collaborate with <Text style={s.textLink} onPress={() => Linking.openURL('http://pintips.net')}>{`PinTips`}</Text> and <Text style={s.textLink} onPress={() => Linking.openURL('http://matchplay.events')}>{`MatchPlay Events`}</Text>.</Text>
                        <Text style={s.text}><Text onPress={ () => this.props.navigation.navigate('Contact')} style={s.textLink}>{`Contact Us`}</Text>. <Text onPress={ () => this.props.navigation.navigate('Blog') } style={s.textLink}>{`Read the blog`}</Text>. <Text onPress={ () => this.props.navigation.navigate('FAQ') } style={s.textLink}>{`Read the FAQ`}</Text>.</Text>
                        <Text style={s.text}>Listen to our podcast, <Text style={s.textLink} onPress={() => Linking.openURL('http://pod.pinballmap.com')}>{`Mappin' Around with Scott & Ryan`}</Text>!</Text>
                        <Text style={s.text}>Follow <Text style={s.textLink} onPress={() => Linking.openURL('https://twitter.com/pinballmapcom')}>@pinballmapcom</Text> on Twitter for updates and news!</Text>
                        <Text style={s.text}>We have a couple of <Text style={s.textLink} onPress={() => Linking.openURL('https://pinballmap.com/store')}>shirts for sale</Text>.</Text>
                        <Text style={s.text}>Want to collaborate on something? <Text style={s.textLink} onPress={() => Linking.openURL('https://pinballmap.com/api/v1/docs')}>We have an API</Text>. You can also contribute to <Text style={s.textLink} onPress={() => Linking.openURL('https://github.com/bpoore/pbm-react')}>this app's code</Text>.</Text>
                        <Text style={s.bold}>App Credits:</Text>
                        <Text style={s.textLink} onPress={() => Linking.openURL('https://github.com/bpoore')}>Beth Poore</Text>
                        <Text style={s.textLink} onPress={() => Linking.openURL('https://github.com/ryantg')}>Ryan Gratzer</Text>
                        <Text style={s.textLink} onPress={() => Linking.openURL('https://github.com/scottwainstock')}>Scott Wainstock</Text>
                        <Text style={[s.textLink,s.text]}>Elijah St Clair</Text>
                        <Text style={s.text}>Thanks to everyone who beta tested the app!</Text>
                        <Text style={s.text}>And thanks to all our <Text style={s.textLink} onPress={() => Linking.openURL('https://patreon.com/pinballmap')}>Patreon</Text>. supporters!</Text>
                        <Text style={s.text}><Image source={require('../assets/images/patreon.png')} resizeMode="contain" onPress={() => Linking.openURL('https://patreon.com/pinballmap')} style={[s.logo]}/></Text>
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
        flex:1,  
        width: deviceWidth - 20,  
    },
    child: {
        margin: "auto",
        padding: 10,
    },
    text: {
        fontSize: 16,
        lineHeight: 22,
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