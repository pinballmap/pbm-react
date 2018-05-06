import React, { Component } from 'react';
import { Button, YellowBox, Text, View } from 'react-native';
import "../config/globals.js"

class SignupLogin extends Component {
  constructor(props){
    super(props);

    this.state ={ num_locations: 0, num_lmxes: 0 }

    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillUpdate is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
      'Warning: Failed prop type',
      'Warning: Each child in an array',
    ]);
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
      <View style={{flex: 1}}>
        <View style={{paddingTop:20}}>
          <Text>Pinball Map is a user-updated map with {this.state.num_locations} locations and {this.state.num_lmxes} machines. You can use it without being logged in. But to help keep it up to date you gotta log in!</Text>
          <Button
            onPress={() => this.props.navigation.navigate('Signup')}
            style={{width:30, paddingTop: 15}}
            title="New User? Sign Up"
            accessibilityLabel="Sign Up"
          />
          <Button
            onPress={() => this.props.navigation.navigate('Login')}
            style={{width:30, paddingTop: 15}}
            title="Current User? Log In"
            accessibilityLabel="Log In"
          />
          <Text>{"I'LL DO THIS LATER"}</Text>
        </View>
      </View>
    );
  }
}

export default SignupLogin;
