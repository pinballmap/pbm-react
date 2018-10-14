import Expo from 'expo'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { PbmStack } from './config/router'

import store from './store'

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <PbmStack />
            </Provider>
        )
    }
}

Expo.registerRootComponent(App)

export default App
