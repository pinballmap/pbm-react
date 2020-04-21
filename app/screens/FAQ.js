import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import {     
    Linking,
    SafeAreaView,
    StyleSheet, 
    View, 
} from 'react-native'
import { ThemeContext } from '../theme-context'
import { MaterialIcons } from '@expo/vector-icons'
import { 
    HeaderBackButton,
    Screen,
    Text, 
} from '../components'

const FAQ = ({ navigation, }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    return(
        <SafeAreaView style={s.background}>
            <Screen>
                <View style={s.container}>
                    <View style={s.child}>
                        <Text style={s.bold}>{`How do I search for a particular machine?`}</Text>
                        <Text style={s.text}>{`When you're on the map screen, click the "filter" button in the upper right, then choose a machine. Then go back to the map and it will only show places with that machine.`}</Text>
                        <Text style={s.bold}>{`The Location List isn't showing a location that I think it should.`}</Text>
                        <Text style={s.text}>{`The Location List lists what is currently shown on the map. If you pan/zoom the map, it will list different things.`}</Text>
                        <Text style={s.bold}>{`When I filter for "Cool Machine (Pro)", I also see results for "Cool Machine (LE)". What's up?`}</Text>
                        <Text style={s.text}>{`This is by design. We've found that most users want to see all versions, and don't want to conduct 3+ separate searches for the same title.`}</Text>
                        <Text style={s.bold}>{`How do I add a new location?`}</Text>
                        <Text style={s.text}>{`Fill out`} <Text onPress={ () => navigation.navigate('SuggestLocation') } style={{textDecorationLine: 'underline'}}>{"this form"}</Text>! {`You can also reach the submission form by clicking the menu icon in the lower right, and choosing "Submit Location". Our administrators moderate submissions, and that can take a few days. The more accurate and thorough your submission, the quicker it will get added!`}</Text>
                        <Text style={s.bold}>{`Can I add my private collection to the map?`}</Text>
                        <Text style={s.text}>{`No. Pinball Map only lists publicly-accessible locations. The definition of 'public' varies - some places have entrance fees, or limited hours. But overall, the location has to be inclusive and accessible. So please don't submit your house or a private club that excludes people from becoming members.`}</Text>
                        <Text style={s.bold}>{`How do I remove a machine from a location?`}</Text>
                        <Text style={s.text}>{`Click on the machine name, and then look for a "remove" button.`}</Text>
                        <Text style={s.bold}>{`This location closed/no longer has machines. What do I do - do I need to tell you?`}</Text>
                        <Text style={s.text}>{`Simply remove all the machines from it. Empty locations are periodically removed.`}</Text>
                        <Text style={s.bold}>{`When I search for a city, the city is listed twice (and maybe the second instance of it is misspelled). Or, I see the same location listed twice. Or, the place is in the wrong spot on the map. Etc.`}</Text>
                        <Text style={s.text}>{`These are data entry mistakes. Please `}<Text onPress={ () => navigation.navigate('Contact') } style={{textDecorationLine: 'underline'}}>{"contact us"}</Text>{` so we can fix them.`}</Text>
                        <Text style={s.bold}>{`How do I get listed as an operator?`}</Text>
                        <Text style={s.text}>{<Text onPress={ () => navigation.navigate('Contact') } style={{textDecorationLine: 'underline'}}>{"Contact us"}</Text>}{ ` and we'll add you.`}</Text>
                        <Text style={s.bold}>{`I can't remember my password. How do I reset it?`}</Text>
                        <Text style={s.text}>{`You can reset it via`} <Text onPress={ () => navigation.navigate('PasswordReset') } style={{textDecorationLine: 'underline'}}>{"this link"}</Text>.</Text>
                        <Text style={s.bold}>{`What is your privacy policy?`}</Text>
                        <Text style={s.text}>Please see the <Text style={{textDecorationLine: 'underline'}} onPress={() => Linking.openURL('http://pinballmap.com/privacy')}>detailed privacy policy on our website</Text>. The overview: We do not track or store user locations, nor store any personal information. We do not sell any user data. We do not use third-party analytics. This site is not monetized. We keep a log of map edits that users make.</Text>
                        <Text style={s.bold}>{`Have a question that we didn't cover here?`} <Text onPress={ () => navigation.navigate('Contact') } style={s.textLink}>{"Ask us!"}</Text></Text>
                    </View>  
                </View>
            </Screen>
        </SafeAreaView>
    )
}

FAQ.navigationOptions = ({ navigation, theme }) => ({
    drawerLabel: 'FAQ',
    drawerIcon: () => <MaterialIcons name='question-answer' style={{fontSize: 24, color: '#6a7d8a'}} />, 
    headerLeft: <HeaderBackButton navigation={navigation} />,
    title: 'FAQ',
    headerRight:<View style={{padding:6}}></View>,
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#1d1c1d' : '#f5fbff',
    },
    headerTintColor: theme === 'dark' ? '#fdd4d7' : '#4b5862',
    headerTitleStyle: {
        textAlign: 'center', 
        flex: 1
    },
    gesturesEnabled: true
})

const getStyles = theme => StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: theme.backgroundColor
    },
    container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        flex: 1,
    },
    child: {
        margin: "auto",
    },
    text: {
        fontSize: 16,
        color: theme.pbmText,
        lineHeight: 22,
        marginBottom: 15,
        marginLeft: 15,
        marginRight: 15,
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        padding: 10,
        color: theme.machineName,
        backgroundColor: theme.buttonColor
    },
    textLink: {
        textDecorationLine: 'underline',
        color: theme.buttonColor,
    },
})

FAQ.propTypes = {
    navigation: PropTypes.object,
}

export default FAQ
