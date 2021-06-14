import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {connect} from "react-redux"
import {
    Dimensions,
    Linking,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'
import Image from 'react-native-scalable-image'
import { ThemeContext } from '../theme-context'
import { getData } from '../config/request'
import { Screen, Text } from '../components'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { HeaderBackButton } from '../components'
import { SafeAreaView } from 'react-native-safe-area-context'

let deviceWidth = Dimensions.get('window').width

const Resources = ({navigation, appAlert}) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    return(
        <SafeAreaView edges={['right', 'bottom', 'left']} style={{flex:1}}>
            <Screen>
                <Text style={s.text}>
                    <Text style={s.bold}>Pinball is fun!</Text>
                   {` Here are some great pinball resources. But this is just the start! You can also often find a local facebook pinball group. If you're a business owner looking to add machines, you can look (via facebook or Pinside) for a local operator who will place, and maintain, machines at your venue.`}
                </Text>
                <View style={s.hr}></View>
                <Pressable onPress={() => Linking.openURL('https://matchplay.events')} style={[s.logoWrapper,{backgroundColor:'#fffbf5',paddingVertical: 10,}]}>
                    <Image source={require('../assets/images/Resource_Matchplay.png')} width={theme.theme === 'dark' ? deviceWidth - 70 : deviceWidth - 50} />
                </Pressable>
                <Text style={s.text}>
                    <Text style={s.textLink} onPress={() => Linking.openURL('https://matchplay.events/')}>{`Match Play Events`}</Text>
                    {` is a tournament app which makes it easy to organize tournaments on any device. Your players can follow standings and results live on their own mobile devices.`}
                </Text>
                <View style={s.hr}></View>
                <Pressable onPress={() => Linking.openURL('https://www.thisweekinpinball.com/')} style={[s.logoWrapper]}>
                    <Image source={require('../assets/images/Resource_TWIP.png')} resizeMode="contain" width={deviceWidth - 50} />
                </Pressable>
                <Text style={s.text}>
                    <Text style={s.textLink} onPress={() => Linking.openURL('https://www.thisweekinpinball.com/')}>{`This Week In Pinball`}</Text>
                    {` is a great resource for keeping up with all the pinball news. Learn about upcoming games, read interviews and reviews, and much more.`}
                </Text>
                <View style={s.hr}></View>
                <Pressable onPress={() => Linking.openURL('https://pindigo.app')} style={[s.logoWrapper,{backgroundColor:'#363377',        paddingVertical: 10,}]}>
                    <Image source={require('../assets/images/Resource_Pindigo.png')} resizeMode="contain" width={deviceWidth - 70} />
                </Pressable>
                <Text style={s.text}>
                    <Text style={s.textLink} onPress={() => Linking.openURL('https://pindigo.app')}>{`Pindigo`}</Text>
                    {` is an app for recording your scores. You can track all your high scores and compare them with friends.`}
                </Text>
                <View style={s.hr}></View>
                <Text style={s.text}>
                    <Text style={s.textLink} onPress={() => Linking.openURL('https://opdb.org/')}>{`OPDB`}</Text>
                    {` - or the Open Pinball Database - is a machine database with an API. Its API is used by us, and a number of other apps. So it's like we're all talking to each other.`}
                </Text>
                <View style={s.hr}></View>
                <Pressable onPress={() => Linking.openURL('https://pintips.net')} style={[s.logoWrapper]}>
                    <Image source={require('../assets/images/Resource_Pintips.png')} width={deviceWidth - 50} />
                </Pressable>
                <Text style={s.text}>
                    <Text style={s.textLink} onPress={() => Linking.openURL('https://pintips.net')}>{`PinTips`}</Text>
                    {` is a great place to quickly pick up some quick tips about specific machines. And it's very easy to contribute your own tips!`}
                </Text>
                <View style={s.hr}></View>
                <Pressable onPress={() => Linking.openURL('https://pinside.com/')} style={[s.logoWrapper]}>
                    <Image source={require('../assets/images/Resource_Pinside.png')} resizeMode="contain" width={deviceWidth - 50} />
                </Pressable>
                <Text style={s.text}>
                    <Text style={s.textLink} onPress={() => Linking.openURL('https://pinside.com/')}>{`Pinside`}</Text>
                    {` is a huge community resource. It's especially useful for solving issues with your machines. But it also has a whole lot more.`}
                </Text>
                <View style={s.hr}></View>
                <Pressable onPress={() => Linking.openURL('https://scorbit.io/')} style={[s.logoWrapper]}>
                    <Image source={require('../assets/images/Resource_Scorbit.png')} resizeMode="contain" width={deviceWidth - 70} />
                </Pressable>
                <Text style={s.text}>
                    <Text style={s.textLink} onPress={() => Linking.openURL('https://scorbit.io/')}>{`Scorbit`}</Text>
                    {` is a platform (hardware/app) for tracking scores - and much more - in real-time. Operators can use it to track earnings. It does a lot, and you can install it on lots of machines.`}
                </Text>
            </Screen>
        </SafeAreaView>
    )

}

Resources.navigationOptions = ({ navigation, theme }) => ({
    drawerLabel: 'Resources',
    drawerIcon: () => <MaterialCommunityIcons name='star-face' style={{ fontSize: 24, color: '#95867c' }} />,
    headerLeft: () => <HeaderBackButton navigation={navigation} />,
    title: 'Pinball Resources',
    headerRight: () =><View style={{padding:6}}></View>,
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#1d1c1d' : '#fffbf5',
        borderBottomWidth: 0,
        elevation: 0,
        shadowColor: 'transparent'
    },
    headerTitleStyle: {
        textAlign: 'center',
    },
    headerTintColor: theme === 'dark' ? '#fdd4d7' : '#766a62',
    gestureEnabled: true
})

const getStyles = theme => StyleSheet.create({
    logoWrapper: {
        alignSelf: 'center',
        paddingHorizontal: 10,
        marginBottom: 20
    },
    text: {
        fontSize: 16,
        lineHeight: 22,
        marginLeft: 15,
        marginRight: 15,
    },
    bold: {
        fontWeight: 'bold',
    },
    textLink: {
        textDecorationLine: 'underline',
        color: '#7cc5ff',
        fontSize: 16,
    },
    hr: {
        marginLeft: 25,
        marginRight: 25,
        height: 2,
        marginVertical: 20,
        backgroundColor: theme.indigo4
    },
})

Resources.propTypes = {
    navigation: PropTypes.object,
    appAlert: PropTypes.string,
}

export default Resources
