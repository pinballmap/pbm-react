import Expo from 'expo';
import React, { Component } from 'react';
import { PbmStack } from './config/router';

class App extends Component {
  render() {
    return <PbmStack />;
  }
}

Expo.registerRootComponent(App);

export default App;
