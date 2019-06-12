import { registerRootComponent } from 'expo'
import React, { Component } from 'react'
import { StatusBar, Platform } from 'react-native'
import { Provider } from 'react-redux'
import { PbmStack } from './config/router'

import store from './store'

class App extends Component {
    componentDidMount() {
        StatusBar.setBarStyle('dark-content')
        
        if (Platform.OS === 'android') {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor('transparent')
        }
    }
    render() {
        return (
            <Provider store={store}>
                <PbmStack />
            </Provider>
        )
    }
}

export default registerRootComponent(App)
