import React, { Component } from 'react';
import { AsyncStorage, Text, Image, ImageBackground, View, StyleSheet } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { getData } from '../config/request';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state={
      errors: false,
      login: '',
      loginError: '',
      password: '',
      passwordError: '',
      apiErrorMsg: '',
    }

  }

  submit = () => {
    this.setState({
      errors: false,
      loginError: '',
      passwordError: '',
    })
    getData(`/users/auth_details.json?login=${this.state.login}&password=${this.state.password}`)
    .then(data => {
      if (data.errors) {
        this.setState({ errors: true })

        if(data.errors === 'Unknown user') 
          this.setState({ loginError: 'Unknown user' })

        if(data.errors === 'Incorrect password') 
          this.setState({ passwordError: 'Incorrect password' })
      }
      if (data.user) {      
        AsyncStorage.setItem('auth', JSON.stringify(data.user))
        this.props.navigation.navigate('Map')
      }
    })
    .catch(err => this.setState({ errors: true, apiErrorMsg: err }))
  }

  render() {
    return (
      <ImageBackground source={require('../assets/images/pbm-fade.png')} style={s.backgroundImage}>
        <View style={s.mask}>
          <View style={s.padding_5}>
            {this.state.errors && 
              <Text style={s.errorText}>
                {this.state.apiErrorMsg ? this.state.apiErrorMsg : 'There were errors trying to process your submission'}
              </Text>
            }
            <Text style={s.bold}>Log In</Text>
            <Input
              placeholder='Username or Email'
              leftIcon={<MaterialIcons name='face' style={s.iconStyle} />}
              onChangeText={login => this.setState({login})}
              value={this.state.login}
              errorStyle={{ color : 'red' }}
              errorMessage={this.state.loginError}
              inputContainerStyle={s.inputBox}
              inputStyle={s.inputText}
              spellCheck = {false}
            />
            <Input 
              placeholder='Password'
              leftIcon={<MaterialIcons name='lock-outline' style={s.iconStyle} />}
              onChangeText={password => this.setState({password})}
              value={this.state.password}
              errorStyle={{ color : 'red' }}
              errorMessage={this.state.passwordError}
              inputContainerStyle={s.inputBox}
              inputStyle={s.inputText}
              secureTextEntry = {true}
              spellCheck = {false}
            />
            <Button
              onPress={() => this.submit()}
              raised
              buttonStyle={s.buttonStyle}
              titleStyle={{
                color:"black", 
                fontSize:18
              }}
              style={{paddingTop: 15,paddingBottom: 25}}
              rounded
              title="Log In"
              accessibilityLabel="Log In"
              disabled={!this.state.login || !this.state.password}
            />
            <Text 
              onPress={() => this.props.navigation.navigate('Map')} 
              style={s.textLink}
              >{"SKIP THIS FOR NOW"}
            </Text>
            <Text
              onPress={() => this.props.navigation.navigate('Signup')}
              style={s.textLink}
              >{"NOT A USER? SIGN UP!"}
            </Text>
            <Text
              //onPress={() => this.props.navigation.navigate('Password')}
              style={s.textLink}
              >{"I forgot my password"}
            </Text>
            <Text
              //onPress={() => this.props.navigation.navigate('Confirm  ')}
              style={s.textLink}
              >{"Resend my confirmation email"}
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const s = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'stretch',
  },
  mask: {
    flex: 1,
    backgroundColor:'rgba(255,255,255,.7)',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red', 
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  padding_5: {
    padding: 5,
  },
  inputBox: {
    width: '100%',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: "#ffffff",
    marginTop: 15,
    marginBottom: 15,
  },
  inputText: {
    color: '#000000',
  },
  textLink: {
    fontSize: 14,
    textAlign: "center",
    paddingBottom: 15,
  },
  iconStyle: {
    fontSize: 24,
    color: '#cccccc',
  },
  buttonStyle: {
    backgroundColor:"#D3ECFF",
    borderRadius: 50,
    width: '100%'
  }
});

export default Login;
