import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { HeaderBackButton } from 'react-navigation'

class FAQ extends Component {
  
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'FAQ', 
            headerLeft: <HeaderBackButton tintColor="#260204" onPress={() => navigation.goBack(null)} />,
            title: 'FAQ',
        }
    }
     
    render(){
        return(
            <ScrollView style={{flex:1}}>
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
                        <Text style={s.bold}>{`Have a question that we didn't cover here?`} <Text onPress={ () => this.props.navigation.navigate('Contact') } style={s.textLink}>{"Ask us!"}</Text></Text>
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
        backgroundColor: "#260204"
    },
    textLink: {
        textDecorationLine: 'underline',
        color: "#D3ECFF",
    },
})

FAQ.propTypes = {
    navigation: PropTypes.object,
}

export default FAQ
