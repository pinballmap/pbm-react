import { registerRootComponent } from 'expo'
import { Appearance } from 'react-native-appearance'
import React, { Component } from 'react'
import { Platform, StatusBar } from 'react-native'
import { ThemeProvider } from 'react-native-elements'
import { Provider } from 'react-redux'
import { PbmStack } from './config/router'

import store from './store'

const theme = Appearance.getColorScheme()

const dark = {
    buttonColor: '#7c6152',
    buttonTextColor: '#bdae9d',
    warningButtonColor: '#67050c',
    backgroundColor: '#2a211c',
    pbmText: '#bdae9d',
    modalBg: '#2a211c',
    backButton: '#bdae9d',
    _f2f4f5: '#2a211c',
    _6a7d8a: '#bdae9d',
    _97a5af: '#bdae9d',
    _e0ebf2: '#7c6152',
    hr: '#7c6152',
}

const standard = {
    buttonColor: '#D3ECFF',
    buttonTextColor: '#4b5862',
    warningButtonColor: '#fdd4d7',
    backgroundColor: '#f5fbff',
    pbmText: '#000e18', 
    modalBg: '#FFF',
    backButton: '#1e9dff',
    _f2f4f5: '#f2f4f5',
    _6a7d8a: '#6a7d8a',
    _97a5af: '#97a5af',
    _e0ebf2: '#e0ebf2',
    hr: '#97a5af',
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
