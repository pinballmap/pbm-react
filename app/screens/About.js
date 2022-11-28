import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import {
    Dimensions,
    Image,
    Linking,
    Platform,
    StyleSheet,
    View,
} from 'react-native'
import { ThemeContext } from '../theme-context'
import { getData } from '../config/request'
import { Screen, Text } from '../components'
import { formatNumWithCommas } from '../utils/utilityFunctions'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as WebBrowser from 'expo-web-browser'

let deviceWidth = Dimensions.get('window').width

const About = ({ navigation, appAlert }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    const [stats, setStats] = useState({
        num_locations: 0,
        num_lmxes: 0,
    })

    const _handleBlogButtonAsync = async () => await WebBrowser.openBrowserAsync('https://blog.pinballmap.com/')

    const _handlePodcastButtonAsync = async () => await WebBrowser.openBrowserAsync('https://pod.pinballmap.com/')

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

    return (
        <SafeAreaView edges={['right', 'bottom', 'left']} style={s.background}>
            <Screen>
                <View style={s.container}>
                    <View style={[s.logoWrapper]}>
                        <Image source={require('../assets/images/pinballmapcom_nocom.png')} resizeMode="contain" style={s.logo} />
                    </View>
                    <View style={s.child}>
                        <View style={s.appAlert}>
                            <Text style={[{ textAlign: 'center', color: theme.text3 }, s.boldHeader]}>Message of the Day</Text>
                            <Text style={[{ color: theme.text3 }, s.text]}>{appAlert}</Text>
                        </View>

                        <Text style={s.text}>Founded in 2008, Pinball Map is an open source, crowdsourced worldwide map of public pinball machines.</Text>

                        <Text style={s.text}>We currently list <Text style={s.boldText}>{formatNumWithCommas(stats.num_locations)}</Text> locations and <Text style={s.boldText}>{formatNumWithCommas(stats.num_lmxes)}</Text> machines. You can update the map using this app or the website: <Text style={s.textLink} onPress={() => Linking.openURL('https://pinballmap.com')}>pinballmap.com</Text>. The data is managed by over 100 administrators and thousands of active users.</Text>

                        <Text style={s.text}>We supply the mapping data for the <Text style={s.textLink} onPress={() => Linking.openURL('https://sternpinball.com/pinball-locator/')}>{`Stern Pinball website`}</Text>, as well as the <Text style={s.textLink} onPress={() => Linking.openURL('https://pindigo.app/')}>{`Pindigo app`}</Text>. We also collaborate with <Text style={s.textLink} onPress={() => Linking.openURL('http://pintips.net')}>{`PinTips`}</Text> and <Text style={s.textLink} onPress={() => Linking.openURL('http://matchplay.events')}>{`MatchPlay Events`}</Text> and <Text style={s.textLink} onPress={() => Linking.openURL('https://scorbit.io/')}>{`Scorbit`}</Text> and more! Want to collaborate on something? <Text style={s.textLink} onPress={() => Linking.openURL('https://pinballmap.com/api/v1/docs')}>We have an API</Text>. You can also contribute to <Text style={s.textLink} onPress={() => Linking.openURL('https://github.com/pinballmap/pbm-react')}>{`this app's code`}</Text>.</Text>

                        <Text style={s.text}><Text onPress={() => navigation.navigate('Contact')} style={s.textLink}>{`Contact Us`}</Text>. Or you can start a discussion about anything on our <Text onPress={() => Linking.openURL('https://github.com/pinballmap/pbm/discussions')} style={s.textLink}>{`Github discussion page`}</Text>.</Text>

                        <Text style={s.text}><Text onPress={_handleBlogButtonAsync} style={s.green}>{`Read the blog`}</Text>. <Text onPress={() => navigation.navigate('FAQ')} style={s.textLink}>{`Read the FAQ (and Privacy Policy)`}</Text>.</Text>

                        <Text style={s.text}>Listen to our podcast, <Text style={s.textLink} onPress={_handlePodcastButtonAsync}>{`Mappin' Around with Scott & Ryan`}</Text>!</Text>

                        <Text style={s.text}>Follow <Text style={s.textLink} onPress={() => Linking.openURL('https://twitter.com/pinballmapcom')}>@pinballmapcom</Text> on Twitter for updates and news!</Text>

                        <Text style={s.text}>We sometimes have a few things for sale <Text style={s.textLink} onPress={() => Linking.openURL('https://pinballmap.com/store')}>on our store</Text>.</Text>

                        <Text style={s.text}>{"And finally, we've compiled some "}<Text style={s.green} onPress={() => navigation.navigate('Resources')}>additional pinball resources</Text>!</Text>

                        <Text style={s.boldHeader}>App Credits:</Text>
                        <Text style={{ fontSize: 16 }}><Text style={s.textLink} onPress={() => Linking.openURL('https://github.com/bpoore')}>Beth Poore</Text> (Development)</Text>
                        <Text style={{ fontSize: 16 }}><Text style={s.textLink} onPress={() => Linking.openURL('https://github.com/ryantg')}>Ryan Gratzer</Text> (Design)</Text>
                        <Text style={{ fontSize: 16 }}><Text style={s.textLink} onPress={() => Linking.openURL('https://github.com/scottwainstock')}>Scott Wainstock</Text> (API)</Text>
                        <Text style={{ fontSize: 16 }}>Elijah St Clair (DevOps)</Text>
                        <Text style={{ fontSize: 16, marginBottom: 10 }}>And other great folks (noted on Github)!</Text>
                        <Text style={s.text}>If you like the app,&nbsp;
                            {Platform.OS === "ios" ?
                                <Text style={s.textLink}
                                    onPress={() => Linking.openURL('itms-apps://itunes.apple.com/us/app/pinball-map/id359275713?mt=8')}>please rate and review it</Text>
                                : <Text style={s.textLink}
                                    onPress={() => Linking.openURL('market://details?id=com.pbm')}>please rate and review it</Text>
                            }
                            !</Text>
                        <Text style={s.text}>Thanks to our beta testers!</Text>
                        <Text style={{ fontSize: 16 }}>And thanks to all our
                            {Platform.OS === "ios" ?
                                <Text style={{ fontSize: 16 }}> Patreon </Text>
                                : <Text style={s.textLink} onPress={() => Linking.openURL('https://patreon.com/pinballmap')}> Patreon </Text>
                            }
                            supporters!</Text>
                    </View>
                    {Platform.OS === "android" ?
                        <View style={[s.logoWrapper]}>
                            <Image source={require('../assets/images/patreon.png')} resizeMode="contain" onPress={() => Linking.openURL('https://patreon.com/pinballmap')} style={[s.patreonLogo]} />
                        </View> : null
                    }
                </View>
            </Screen>
        </SafeAreaView >
    )

}

const getStyles = theme => StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: theme.base1
    },
    container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        flex: 1,
    },
    logoWrapper: {
        flex: 2,
        margin: "auto",
        paddingTop: 10,
        paddingHorizontal: 10,

    },
    logo: {
        flex: 1,
        width: deviceWidth - 20,
        borderRadius: Platform.OS === "ios" ? 10 : 0,
        backgroundColor: '#fee7f5',
    },
    patreonLogo: {
        flex: 1,
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
    boldText: {
        fontFamily: 'boldFont',
    },
    boldHeader: {
        fontFamily: 'boldFont',
        fontSize: 18,
        marginBottom: 10
    },
    textLink: {
        textDecorationLine: 'underline',
        color: theme.pink1,
        fontSize: 16,
    },
    appAlert: {
        borderWidth: 1,
        borderColor: theme.text2,
        borderRadius: 10,
        margin: 10,
        paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 0,
        backgroundColor: theme.white
    },
    green: {
        color: theme.green,
        textDecorationLine: 'underline',
        fontSize: 16,
    }
})

About.propTypes = {
    navigation: PropTypes.object,
    appAlert: PropTypes.string,
}

const mapStateToProps = ({ regions }) => {
    const appAlert = regions.regions.filter(region => region.id === 1)[0].motd

    return {
        appAlert,
    }
}
export default connect(mapStateToProps)(About)
