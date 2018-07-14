import React, { Component } from 'react';
import { AsyncStorage, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements'
import { postData } from '../config/request'

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
          this.props.navigation.navigate('Map')
        }
      })
      .catch(err => this.setState({ errors: true, apiErrorMsg: err }))
    }
  }

  render() {
    return (
      <View>
        {this.state.errors && 
          <Text style={{color: 'red', fontWeight: 'bold'}}>
            {this.state.apiErrorMsg ? this.state.apiErrorMsg : 'There were errors trying to process your submission'}
          </Text>
        }
        <Input 
          label='Username' 
          onChangeText={username => this.setState({username})}
          value={this.state.username}
          errorStyle={{ color : 'red' }}
          errorMessage={this.state.usernameError}
        />
        <Input 
          label="Email Address" 
          onChangeText={email => this.setState({email})}
          value={this.state.value}
          errorStyle={{ color : 'red' }}
          errorMessage={this.state.emailError}
        />
        <Input 
          label="Password" 
          onChangeText={password => this.setState({password})}
          value={this.state.password}
          errorStyle={{ color : 'red' }}
          errorMessage={this.state.passwordError}
        />
        <Input 
          label="Confirm Password" 
          onChangeText={confirm_password => this.setState({confirm_password})}
          value={this.state.confirm_password}
          errorStyle={{ color : 'red' }}
          errorMessage={this.state.confirm_passwordError}
        />
        <Button
          onPress={() => this.submit()}
          title="Join"
        />
      </View>
    );
  }
}

export default Signup;
