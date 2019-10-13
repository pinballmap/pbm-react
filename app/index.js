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
    pbmText: '#FFF',
    buttonTextColor: '#FFF',
    modalBg: '#000',
    backButton: '#FFF',
    _f2f4f5: '#000',
    _6a7d8a: '#FFF',
    _97a5af: '#FFF',
}

const standard = {
    buttonColor: '#D3ECFF',
    backgroundColor: '#f5fbff',
    pbmText: '#000e18', 
    buttonTextColor: '#4b5862',
    modalBg: '#FFF',
    backButton: '#1e9dff',
    _f2f4f5: '#f2f4f5',
    _6a7d8a: '#6a7d8a',
    _97a5af: '#97a5af',
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
