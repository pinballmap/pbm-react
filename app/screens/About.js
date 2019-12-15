import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { 
    Dimensions,
    Image, 
    Linking,
    Platform,
    StyleSheet, 
    View, 
} from 'react-native'
import { ThemeContext } from 'react-native-elements'
import { getData } from '../config/request'
import { Screen, Text } from '../components'
import { MaterialIcons } from '@expo/vector-icons'
import { HeaderBackButton } from '../components'
import { formatNumWithCommas } from '../utils/utilityFunctions'

let deviceWidth = Dimensions.get('window').width

const About = () => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)
    
    const [stats, setStats] = useState({
        num_locations: 0,
        num_lmxes: 0,
    })

    useEffect(() => {
        let isCancelled = false

        getData('/regions/location_and_machine_counts.json')
            .then(data => {                
                if (!isCancelled) {
                    if (data && data.num_lmxes && data.num_locations) {
                        setStats({
                            num_lmxes: data.num_lmxes,
                            num_locations: data.num_locations,
                        })
                    } 
                }
            })

        return () => {
            isCancelled = true
        }
    })
     
    return(
        <Screen>
            <View style={s.container}>
                <View style={[s.logoWrapper]}>
                    <Image source={require('../assets/images/pinballmapcom_nocom.png')} resizeMode="contain" style={s.logo}/>
                </View>
                <View style={s.child}>
                    <Text style={s.text}>Pinball Map is a crowdsourced map of all public pinball machines. It was founded in 2008 in Portland, Oregon.</Text>
                    <Text style={s.text}>We currently list {formatNumWithCommas(stats.num_locations)} locations and {formatNumWithCommas(stats.num_lmxes)} machines. You can update the map using this app or the website: <Text style={s.textLink} onPress={() => Linking.openURL('https://pinballmap.com')}>pinballmap.com</Text>. The data is managed by over 100 administrators and thousands of active users.</Text>                        
                    <Text style={s.text}>We supply the mapping data for the <Text style={s.textLink} onPress={() => Linking.openURL('https://sternpinball.com/pinball-locator/')}>{`Stern Pinball website`}</Text>, as well as the <Text style={s.textLink} onPress={() => Linking.openURL('https://pindigo.app/')}>{`Pindigo app`}</Text>. We also collaborate with <Text style={s.textLink} onPress={() => Linking.openURL('http://pintips.net')}>{`PinTips`}</Text> and <Text style={s.textLink} onPress={() => Linking.openURL('http://matchplay.events')}>{`MatchPlay Events`}</Text>.</Text>
                    <Text style={s.text}><Text onPress={ () => this.props.navigation.navigate('Contact')} style={s.textLink}>{`Contact Us`}</Text>. <Text onPress={ () => this.props.navigation.navigate('Blog') } style={s.textLink}>{`Read the blog`}</Text>. <Text onPress={ () => this.props.navigation.navigate('FAQ') } style={s.textLink}>{`Read the FAQ (and Privacy Policy)`}</Text>.</Text>
                    <Text style={s.text}>Listen to our podcast, <Text style={s.textLink} onPress={() => Linking.openURL('http://pod.pinballmap.com')}>{`Mappin' Around with Scott & Ryan`}</Text>!</Text>
                    <Text style={s.text}>Follow <Text style={s.textLink} onPress={() => Linking.openURL('https://twitter.com/pinballmapcom')}>@pinballmapcom</Text> on Twitter for updates and news!</Text>
                    <Text style={s.text}>We have a couple of <Text style={s.textLink} onPress={() => Linking.openURL('https://pinballmap.com/store')}>shirts for sale</Text>.</Text>
                    <Text style={s.text}>Want to collaborate on something? <Text style={s.textLink} onPress={() => Linking.openURL('https://pinballmap.com/api/v1/docs')}>We have an API</Text>. You can also contribute to <Text style={s.textLink} onPress={() => Linking.openURL('https://github.com/bpoore/pbm-react')}>{`this app's code`}</Text>.</Text>
                    <Text style={s.bold}>App Credits:</Text>
                    <Text style={{fontSize:16}}><Text style={s.textLink} onPress={() => Linking.openURL('https://github.com/bpoore')}>Beth Poore</Text> (Development)</Text>
                    <Text style={{fontSize:16}}><Text style={s.textLink} onPress={() => Linking.openURL('https://github.com/ryantg')}>Ryan Gratzer</Text> (Design)</Text>
                    <Text style={{fontSize:16}}><Text style={s.textLink} onPress={() => Linking.openURL('https://github.com/scottwainstock')}>Scott Wainstock</Text> (API)</Text>
                    <Text style={{fontSize:16}}>Elijah St Clair (DevOps)</Text>
                    <Text style={{fontSize:16,marginBottom: 10}}>Landon Orr (Contributor)</Text>
                    <Text style={s.text}>If you like the app,&nbsp; 
                        {Platform.OS === "ios" ? 
                            <Text style={s.textLink}        
                                onPress={() => Linking.openURL('itms-apps://itunes.apple.com/us/app/pinball-map/id359275713?mt=8')}>please rate and review it</Text>
                            : <Text style={s.textLink}        
                                onPress={() => Linking.openURL('market://details?id=com.pbm')}>please rate and review it</Text> 
                        }
                                !</Text>
                    <Text style={s.text}>Thanks to our beta testers!</Text>
                    <Text style={{fontSize:16}}>And thanks to all our 
                        {Platform.OS === "ios" ? 
                            <Text style={{fontSize:16}}> Patreon </Text>
                            : <Text style={s.textLink} onPress={() => Linking.openURL('https://patreon.com/pinballmap')}> Patreon </Text>
                        }
                                supporters!</Text>
                </View>  
                {Platform.OS === "android" ?
                    <View style={[s.logoWrapper]}>
                        <Image source={require('../assets/images/patreon.png')} resizeMode="contain" onPress={() => Linking.openURL('https://patreon.com/pinballmap')} style={[s.logo]}/>
                    </View>: null
                }
            </View>
        </Screen>
    )

}

About.navigationOptions = ({ navigation, theme }) => ({
    drawerLabel: 'About',
    drawerIcon: () => <MaterialIcons name='info-outline' style={{ fontSize: 24, color: '#6a7d8a' }} />,
    headerLeft: <HeaderBackButton navigation={navigation} />,
    title: 'About',
    headerRight:<View style={{padding:6}}></View>,
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#2a211c' : '#f5fbff',
    },
    headerTintColor: theme === 'dark' ? '#fdd4d7' : '#4b5862',
    headerTitleStyle: {
        textAlign: 'center', 
        flex: 1
    },
    gesturesEnabled: true
})

const getStyles = theme => StyleSheet.create({
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
        color: theme.red,
        fontSize: 16,
    },
})

About.propTypes = {
    navigation: PropTypes.object,
}

export default About
