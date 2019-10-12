import { registerRootComponent } from 'expo'
//import { AppearanceProvider } from 'react-native-appearance'
import { Appearance } from 'react-native-appearance'
import React, { Component } from 'react'
import { Platform, StatusBar } from 'react-native'
import { ThemeProvider } from 'react-native-elements'
import { Provider } from 'react-redux'
import { PbmStack } from './config/router'

import store from './store'

const theme = Appearance.getColorScheme()

const dark = {
    buttonColor: '#000',
    backgroundColor: '#000',
    textColor: '#FFF',
    modalBg: '#000',
    backButton: '#FFF'
}

const standard = {
    buttonColor: '#D3ECFF',
    backgroundColor: '#f5fbff',
    textColor: '#4b5862',
    modalBg: '#FFF',
    backButton: '#1e9dff'
}

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
            <ThemeProvider theme={theme === 'dark' ? dark : standard}>
                <Provider store={store}>
                    <PbmStack theme={theme} />
                </Provider>
            </ThemeProvider>
        )
    }
}

export default registerRootComponent(App)
