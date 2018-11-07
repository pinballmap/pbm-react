import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ActivityIndicator, Image, StyleSheet, Text, View, ImageBackground } from 'react-native'
import { Button } from 'react-native-elements'
import { loginLater } from '../actions/user_actions'
import { getData } from '../config/request'
import "../config/globals.js"

export class SignupLogin extends Component {
    constructor(props){
        super(props)

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
                  })
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
            <ImageBackground source={require('../assets/images/app_logo.jpg')} style={s.backgroundImage}>
            <View style={s.mask}>
                <View style={s.logoWrapper}>
                    <Image source={require('../assets/images/pinballmapcom_nocom.png')} style={s.logo}/>
                </View>
                <View style={s.outerBorder}>
                    <View style={s.textBg}>
                        <Text style={{fontSize:18,textAlign:"center"}}>
                            To show you pinball machines near you, you’ll need to enable location services for this app.
                        </Text>
                    </View>               
                </View>
                <View style={{padding:15}}>
                    <Button
                        //Clear error state to allow user to proceed either way
                        onPress={ () => this.setState({ showTurnOnLocationServices: false}) }
                        raised
                        buttonStyle={s.buttonBlue}
                        titleStyle={s.titleStyle}
                        title="Enable Location Services"
                        accessibilityLabel="Enable Location Services"
                        containerStyle={{borderRadius:50}}
                        style={{borderRadius: 50}}
                    />                    
                </View>
            </View>
        </ImageBackground>
          )
      }
    
      return(
          <ImageBackground source={require('../assets/images/app_logo.jpg')} style={s.backgroundImage}>
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
                          containerStyle={{borderRadius:50}}
                          style={{borderRadius: 50}}
                      />
                      <Button
                          onPress={() => this.props.navigation.navigate('Signup')}
                          raised
                          buttonStyle={s.buttonPink}
                          titleStyle={s.titleStyle}
                          title="New User? Sign Up"
                          accessibilityLabel="Sign Up"
                          containerStyle={{borderRadius:50,marginTop:15,marginBottom:25}}
                          style={{borderRadius: 50}}
                      />
                      <Text 
                          onPress={() => {
                              this.props.loginLater()
                              this.props.navigation.navigate('Map')}} 
                          style={{fontSize:14,textAlign:"center"}}
                      >{"skip this for now"}
                      </Text>
                  </View>
              </View>
          </ImageBackground>
      )
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
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15
    },
    logo: {
        width: '100%',
        resizeMode: 'contain',
    },
    buttonPink: {
        backgroundColor:"#fdd4d7",
        borderRadius: 50,
        elevation: 0
    },
    buttonBlue: {
        backgroundColor:"#D3ECFF",
        borderRadius: 50,
        elevation: 0
    },
    titleStyle: {
        color:"black",
        fontSize:18
    }
})

SignupLogin.propTypes = {
    user: PropTypes.object,
    loginLater: PropTypes.func,
    navigation: PropTypes.object,
}

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch) => ({
    loginLater: () => dispatch(loginLater())
})

export default connect(mapStateToProps, mapDispatchToProps)(SignupLogin)