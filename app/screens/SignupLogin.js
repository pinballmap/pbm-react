import React, { Component } from 'react';
import { connect } from 'react-redux'
import { ActivityIndicator, Image, StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements'
import { loginLater } from '../actions/user_actions'
import { getData } from '../config/request'
import "../config/globals.js"

export class SignupLogin extends Component {
  constructor(props){
    super(props);

    this.state ={ 
      num_locations: 0, 
      num_lmxes: 0, 
      apiError: '',
      showTurnOnLocationServices: true,
    }
  }

  static navigationOptions = { header: null };

  componentDidMount(){
    getData('/regions/location_and_machine_counts.json')
      .then(data => {
        if (data && data.num_lmxes && data.num_locations) {
          this.setState({
            num_lmxes: data.num_lmxes,
            num_locations: data.num_locations,
          });
        } else {
          this.setState({
            apiError: data
          })
        }
      })
      .catch(apiError => this.setState({ apiError }))
  }

  render(){
    if (this.props.user.isFetchingLocationTrackingEnabled || (this.state.num_lmxes === 0 && !this.state.apiError)) {
      return <ActivityIndicator />
    }
    
    if (!this.props.user.locationTrackingServicesEnabled && this.state.showTurnOnLocationServices) {
      return (
        <View>
          <Text>To show you pinball machines near you, you’ll need to enable location services for this app</Text>
          <Button
            //Clear error state to allow user to proceed either way
            onPress={ () => this.setState({ showTurnOnLocationServices: false}) }
            title="OK"
          />
        </View>
      )
    }
    
    return(
      <ImageBackground source={require('../assets/images/app_logo-350.jpg')} style={s.backgroundImage}>
        <View style={s.mask}>
          <View style={s.logoWrapper}>
            <Image source={require('../assets/images/pinballmapcom_nocom.png')} style={s.logo}/>
          </View>
          <View style={s.outerBorder}>
            <View style={s.textBg}>
              {this.state.apiError ? 
                <Text>Oops. Something went wrong!</Text> :
                <Text style={{fontSize:18,textAlign:"center"}}>
                  <Text>Pinball Map is a user-updated map listing</Text>
                  <Text style={s.bold}> {this.state.num_locations} </Text> 
                  <Text>locations and</Text>
                  <Text style={s.bold}> {this.state.num_lmxes} </Text>
                  <Text>machines.</Text>
                  {"\n"}{"\n"}
                  <Text>You can use it without being logged in. But to help keep it up to date you gotta log in!</Text>
                </Text>
              }
            </View>
          </View>
          <View style={{padding:15}}>
            <Button
              onPress={() => this.props.navigation.navigate('Login')}
              raised
              buttonStyle={s.buttonBlue}
              titleStyle={s.titleStyle}
              title="Current User? Log In"
              accessibilityLabel="Log In"
            />
            <Button
              onPress={() => this.props.navigation.navigate('Signup')}
              raised
              buttonStyle={s.buttonPink}
              titleStyle={s.titleStyle}
              style={{paddingTop: 15,paddingBottom: 25}}
              rounded
              title="New User? Sign Up"
              accessibilityLabel="Sign Up"
            />
            <Text 
              onPress={() => {
                this.props.loginLater()
                this.props.navigation.navigate('Map')}} 
              style={{fontSize:14,textAlign:"center"}}
              >{"SKIP THIS FOR NOW"}
            </Text>
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
    flexDirection: 'column',
    justifyContent: 'center',
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
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
  },
  buttonPink: {
    backgroundColor:"#fdd4d7",
    borderRadius: 50,
  },
  buttonBlue: {
    backgroundColor:"#D3ECFF",
    borderRadius: 50,
  },
  titleStyle: {
    color:"black",
    fontSize:18
  }
});

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch) => ({
  loginLater: () => dispatch(loginLater())
})

export default connect(mapStateToProps, mapDispatchToProps)(SignupLogin)