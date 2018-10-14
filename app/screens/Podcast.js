import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, ScrollView, Image, Linking, Text, View } from 'react-native'
import { HeaderBackButton } from 'react-navigation'

class Podcast extends Component {
     
  static navigationOptions = ({ navigation }) => {
      return {
          drawerLabel: 'Podcast', 
          headerLeft: <HeaderBackButton tintColor="#888888" onPress={() => navigation.goBack(null)} title="Map" />,
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
                      <Text style={s.text}>Please enjoy Mappin’ Around w/ Scott and Ryan, a podcast about Pinball Map! We release a new episode once a month.</Text>
                      <Text style={s.link}
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
    link: {
        textDecorationLine: 'underline',
        fontSize: 16,
        textAlign: 'center',
        paddingTop: 15,
        paddingBottom: 15
    }
})

Podcast.propTypes = {
    navigation: PropTypes.object,
}

export default Podcast
