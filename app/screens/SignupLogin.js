import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements'
import "../config/globals.js"

class SignupLogin extends Component {
  constructor(props){
    super(props);

    this.state ={ num_locations: 0, num_lmxes: 0 }
  }

  componentWillMount(){
    return fetch(global.api_url + '/regions/location_and_machine_counts.json')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          num_locations: responseJson.num_locations.toLocaleString(navigator.language, { minimumFractionDigits: 0 }),
          num_lmxes: responseJson.num_lmxes.toLocaleString(navigator.language, { minimumFractionDigits: 0 })
        }, function(){});
      });
  }

  render(){
    return(
      <ImageBackground source={require('../assets/images/app_logo-350.jpg')} style={s.backgroundImage}>
        <View style={s.mask}>
          <View style={s.logoWrapper}>
            <Image source={require('../assets/images/pinballmapcom_nocom.png')} style={s.logo}/>
          </View>
          <View style={s.outerBorder}>
            <View style={s.textBg}>
              <Text style={{fontSize:18,textAlign:"center"}}>
                <Text>Pinball Map is a user-updated map listing</Text>
                <Text style={s.bold}> {this.state.num_locations} </Text> 
                <Text>locations and</Text>
                <Text style={s.bold}> {this.state.num_lmxes} </Text>
                <Text>machines.</Text>
                {"\n"}{"\n"}
                <Text>You can use it without being logged in. But to help keep it up to date you gotta log in!</Text>
              </Text>
            </View>
          </View>
          <View style={{padding:15}}>
            <Button
              onPress={() => this.props.navigation.navigate('Login')}
              raised
              fontSize={18}
              backgroundColor="#D3ECFF"
              color="black"
              rounded
              title="Current User? Log In"
              accessibilityLabel="Log In"
            />
            <Button
              onPress={() => this.props.navigation.navigate('Signup')}
              raised
              fontSize={18}
              backgroundColor="#fdd4d7"
              color="black"
              style={{paddingTop: 15,paddingBottom: 25}}
              rounded
              title="New User? Sign Up"
              accessibilityLabel="Sign Up"
            />
            <Text style={{fontSize:14,textAlign:"center"}} onPress={() => this.props.navigation.navigate('EnableLocationServices')}>{"I'LL DO THIS LATER"}</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const s = StyleSheet.create({
  mask: {
    flex: 1,
    backgroundColor:'rgba(255,255,255,.8)',
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
  },
  bold: {
    fontWeight:"bold",
  },
  outerBorder: {
    margin:20,
    borderRadius:10,
    borderWidth:4,
    borderColor:'rgba(0,0,0,.4)',
  },
  textBg: {
    padding:10,
    borderRadius:10,
    backgroundColor:'rgba(255,255,255,.6)',
  },
  logoWrapper: {
    padding: 5,
    backgroundColor: '#D3ECFF',
    height: 60,
    opacity: .9,
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
  }
});

export default SignupLogin;
