import Expo from 'expo';
import React, { Component } from 'react';
import { PbmStack } from './config/router';
import { YellowBox } from 'react-native';

class App extends Component {
  constructor(props){
    super(props);

    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillUpdate is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
      'Warning: Failed prop type',
      'Warning: Each child in an array',
    ]);
  }

  render() {
    return <PbmStack />;
  }
}

Expo.registerRootComponent(App);

export default App;
