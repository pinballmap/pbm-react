import React, { Component } from 'react';
import { AsyncStorage, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements'
import { getData } from '../config/request'

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
      <View>
        {this.state.errors && 
          <Text style={{color: 'red', fontWeight: 'bold'}}>
            {this.state.apiErrorMsg ? this.state.apiErrorMsg : 'There were errors trying to process your submission'}
          </Text>
        }
        <Text>Log In</Text>
        <Input 
          label='Username or Email' 
          onChangeText={login => this.setState({login})}
          value={this.state.login}
          errorStyle={{ color : 'red' }}
          errorMessage={this.state.loginError}
        />
        <Input 
          label="Password" 
          onChangeText={password => this.setState({password})}
          value={this.state.password}
          errorStyle={{ color : 'red' }}
          errorMessage={this.state.passwordError}
        />
        <Button
          onPress={() => this.submit()}
          disabled={!this.state.login || !this.state.password}
          title="Login"
        />
      </View>
    );
  }
}

export default Login;
