import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, Text, View, Image, ImageBackground, StyleSheet } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements'
import { setLoggedIn, loginLater } from '../actions/user_actions'
import { postData } from '../config/request'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      usernameError: '',
      emailError: '',
      passwordError: '',
      confirm_passwordError: '',
      errors: false,
      user: {},
      apiErrorMsg: '',
    };
  }

  static navigationOptions = { header: null };

  validateFields = () => {
    if (!this.state.username) {
      this.setState({ 
        usernameError: 'EMPTY USERNAME',
        errors: true,
      })
    } else if (this.state.username.length > 15) {
      this.setState({
        usernameError: 'Username is too long (maximum is 15 characters',
        errors: true,
      })
    } else if (!(/^[a-zA-Z0-9_\.]*$/).test(this.state.username)) {
      this.setState({
        usernameError: 'Username must be alphanumeric',
        errors: true,
      })
    }

    if (!this.state.email) {
      this.setState({ 
        emailError: 'EMPTY EMAIL', 
        errors: true, 
      })
    } else if (!this.state.email.includes('@')) {
      this.setState({ 
        emailError: 'Email is invalid',
        errors: true,
      })
    }

    if (!this.state.password) {
      this.setState({ 
        passwordError: 'EMPTY PASSWORD',
        errors: true,
      })
    } else if (this.state.password.length < 6) {
      this.setState({ 
        passwordError: 'Password is too short (minimum is 6 characters)',
        errors: true,
      })
    }

    if (this.state.password !== this.state.confirm_password) {
      this.setState({ 
        confirm_passwordError: "DOESN'T MATCH PASSWORD",
        errors: true,
      })    
    }
  }

  submit = () => {
    // Reset error states upon a submission / resubmission
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
      confirm_passwordError: '',
      apiErrorMsg: '',
      errors: false,
    })

    this.validateFields()

    if(!this.state.errors) {
      const body = {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        confirm_password: this.state.confirm_password
      }

      postData('/users/signup.json', body)
      .then(data => {
        // Something goes wrong with the API request
        if (data.message) {
          this.setState({ apiErrorMsg: data.message})
          this.setState({ errors: true })
        }
      
        if (data.errors) {
          this.setState({ errors: true })
          const errors = data.errors.split(",")

          if (errors.indexOf('Username is invalid') > -1) {
            this.setState({ usernameError: 'Username is invalid' })
          }

          if (errors.indexOf('Username has already been taken') > -1) {
            this.setState({ usernameError: 'Username has already been taken'})
          }

          if (errors.indexOf('Email is invalid') > -1) {
            this.setState({ emailError: 'Email is invalid' })
          }
        }

        if (data.user) {      
          AsyncStorage.setItem('auth', JSON.stringify(data.user))
          this.props.setLoggedIn(true)
          this.props.navigation.navigate('Map')
        }
      })
      .catch(err => this.setState({ errors: true, apiErrorMsg: err }))
    }
  }

  render() {
    return (
      <ImageBackground source={require('../assets/images/t-shirt-logo.png')} style={s.backgroundImage}>
        <View style={s.mask}>
          <View style={s.padding_5}>
            {this.state.errors && 
              <Text style={s.errorText}>
                {this.state.apiErrorMsg ? this.state.apiErrorMsg : 'There were errors trying to process your submission'}
              </Text>
            }
            <Text style={s.bold}>Sign Up</Text>
            <Input 
              placeholder='Username'
              leftIcon={<MaterialIcons name='face' style={s.iconStyle} />}
              onChangeText={username => this.setState({username})}
              value={this.state.username}
              errorStyle={{ color : 'red' }}
              errorMessage={this.state.usernameError}
              inputContainerStyle={s.inputBox}
              inputStyle={s.inputText}
              spellCheck = {false}
            />
            <Input 
              placeholder="Email Address" 
              leftIcon={<MaterialCommunityIcons name='email-outline' style={s.iconStyle} />}
              onChangeText={email => this.setState({email})}
              value={this.state.value}
              errorStyle={{ color : 'red' }}
              errorMessage={this.state.emailError}
              inputContainerStyle={s.inputBox}
              inputStyle={s.inputText}
              spellCheck = {false}
            />
            <Input 
              placeholder="Password"
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
            <Input 
              placeholder="Confirm Password"
              leftIcon={<MaterialIcons name='lock-outline' style={s.iconStyle} />}
              onChangeText={confirm_password => this.setState({confirm_password})}
              value={this.state.confirm_password}
              errorStyle={{ color : 'red' }}
              errorMessage={this.state.confirm_passwordError}
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
              title="Sign Up"
              accessibilityLabel="Sign Up"
              disabled={!this.state.username || !this.state.email || !this.state.password || !this.state.confirm_password}
            />
            <Text 
              onPress={() => {
                this.props.loginLater()
                this.props.navigation.navigate('Map')
              }} 
              style={s.textLink}
              >{"SKIP THIS FOR NOW"}
            </Text>
            <Text
              onPress={() => this.props.navigation.navigate('Login')}
              style={s.textLink}
              >{"ALREADY A USER? LOG IN!"}
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
  },
  mask: {
    flex: 1,
    backgroundColor:'rgba(255,255,255,.8)',
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
    paddingBottom: 10,
  },
  iconStyle: {
    fontSize: 24,
    color: '#cccccc',
  },
  buttonStyle: {
    backgroundColor:"#fdd4d7",
    borderRadius: 50,
    width: '100%'
  }
});

const mapStateToProps = ({ }) => ({ })
const mapDispatchToProps = (dispatch) => ({
    setLoggedIn: status => dispatch(setLoggedIn(status)),
    loginLater: () => dispatch(loginLater()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

