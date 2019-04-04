import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {     
    SafeAreaView,
    ScrollView, 
    StyleSheet, 
    View, 
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { 
    getStatusBarHeight,
    ifIphoneX,
} from 'react-native-iphone-x-helper'
import { 
    HeaderBackButton,
    Text, 
} from '../components'

class FAQ extends Component {
  
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'FAQ',
            drawerIcon: () => <MaterialIcons name='question-answer' style={[s.drawerIcon]} />, 
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: 'FAQ',
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
            <SafeAreaView style={{flex:1,backgroundColor:'#f5fbff'}}>
                <ScrollView style={{flex:1,backgroundColor:'#f5fbff'}}>
                    <View style={s.container}>
                        <View style={s.child}>
                            <Text style={s.bold}>{`How do I search for a particular machine?`}</Text>
                            <Text style={s.text}>{`When you're on the map screen, click the "filter" button in the upper right, then choose a machine. Then go back to the map and it will only show places with that machine.`}</Text>
                            <Text style={s.bold}>{`How do I add a new location?`}</Text>
                            <Text style={s.text}>{`Click the menu icon in the lower right, and choose "Add Location". Then fill out the form! We moderate the submissions, so it will a few days for the location you submitted to be added to the map. The more accurate and thorough your submission, the quicker it will get added! Make sure to include at least one machine with your submission.`}</Text>
                            <Text style={s.bold}>{`How do I remove a machine from a location?`}</Text>
                            <Text style={s.text}>{`Click on the machine name, and then look for a "remove" button.`}</Text>
                            <Text style={s.bold}>{`This location closed/no longer has machines.`}</Text>
                            <Text style={s.text}>{`Simply remove all the machines from it. Empty locations are periodically removed.`}</Text>
                            <Text style={s.bold}>{`What is your privacy policy?`}</Text>
                            <Text style={s.text}>{`We do not track or store user locations, nor store any personal information. We do not sell any user data. We do not use third-party analytics. This site is not monetized. We keep a log of map edits that users make.`}</Text>
                            <Text style={s.bold}>{`Have a question that we didn't cover here?`} <Text onPress={ () => this.props.navigation.navigate('Contact') } style={s.textLink}>{"Ask us!"}</Text></Text>
                        </View>  
                    </View>
                </ScrollView>
            </SafeAreaView>
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
    child: {
        margin: "auto",
    },
    text: {
        fontSize: 16,
        marginBottom: 15,
        marginLeft: 15,
        marginRight: 15,
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        padding: 10,
        color: "#f5fbff",
        backgroundColor: "#6a7d8a"
    },
    textLink: {
        textDecorationLine: 'underline',
        color: "#D3ECFF",
    },
    drawerIcon: {
        fontSize: 24,
        color: '#6a7d8a'
    },
})

FAQ.propTypes = {
    navigation: PropTypes.object,
}

export default FAQ
