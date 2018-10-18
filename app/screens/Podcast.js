import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, ScrollView, Image, Linking, Text, View } from 'react-native'
import { HeaderBackButton } from 'react-navigation'

class Podcast extends Component {
     
  static navigationOptions = ({ navigation }) => {
      return {
          drawerLabel: 'Podcast', 
          headerLeft: <HeaderBackButton tintColor="#00487e" onPress={() => navigation.goBack(null)} />,
          title: 'Podcast',
      }
  }

  render(){
      return(
          <ScrollView style={{flex:1}}>
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
        width: 300,
        height: 300,
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
    }
})

Podcast.propTypes = {
    navigation: PropTypes.object,
}

export default Podcast
