import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, YellowBox, View } from 'react-native';
// import styles from '../styles/styles.js'; //I don't think this worked
// import Button from './components/button'; //I got an error "module does not exist in the module map" even though the path should have been correct.

export default class FetchExample extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
    ]);
  }

  render(){

    return(
      <View style={{flex: 1, paddingTop:20,backgroundColor: '#EFEFEF'}}>
      <View style={styles.welcome}>
        <Image source={require('./images/pinballmapcom_nocom.png')} style={styles.logo}/>
      </View>
      <View> 
        <Text style={styles.choose}>login</Text>
      </View>
      <View style={styles.loginForm}>
        <Text style={styles.hint}>username</Text>
        <TextInput
          placeholder="username or email"
          keyboardType="default"
          autoCapitalize='none'
          autoCorrect={false}
          returnKeyType='next'
          style={styles.inputText} />
      </View>

      <View style={styles.loginForm}>
        <Text style={styles.hint}>password</Text>
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          keyboardType="default"
          autoCapitalize='none'
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          returnKeyType='done'
          style={styles.inputText} />
      </View>

      <Button
        style={styles.button}
        onPress={this.onAuthButton}
        title="login button"
        />

    </View>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    padding: 5,
    backgroundColor: '#D3ECFF',
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
  },
  choose: {
    fontSize: 22,
    textAlign: 'center',
    padding: 10,
    fontWeight: 'bold',
    color: '#433A3A',
  },
  loginForm: {
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#EFEFEF',
  },
  hint: {
    fontSize: 18,
    color: '#433A3A',
  },
  inputText: {
    fontSize: 20,
    color: '#433A3A',
    borderColor: '#D3ECFF',
    borderRadius: 10,
    height: 50,
    borderWidth: 4,
    backgroundColor : "#FFFFFF",
    padding: 5,
  },
  button: { //doesn't work, maybe because of the onpress lint error?
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D3ECFF',
    alignItems: 'center',
    backgroundColor: '#D3ECFF',
  }
});
