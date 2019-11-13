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
    theme: 'dark',
    buttonColor: '#7c6152',
    buttonTextColor: '#bdae9d',
    warningButtonColor: '#67050c',
    backgroundColor: '#2a211c',
    pbmText: '#bdae9d',
    modalBg: '#2a211c',
    backButton: '#bdae9d',
    _f2f4f5: '#2a211c',
    _6a7d8a: '#493931',
    _97a5af: '#bdae9d',
    _e0ebf2: '#7c6152',
    _e0f1fb: '#493931',
    _f5fbff: '#bdae9d',
    d_493931: '#493931',
    d_9a836a: '#9a836a',
    hr: '#7c6152',
    placeholder: '#9a836a',
    meta: '#9a836a',
    borderColor: '#7c6152',
    loading: '#493931',
    _fff: '#493931',
    _eee: '#2a211c',
    addBtnBorderW: 1,
    addBtnBorderColor: '#bdae9d',
    drawerText: '#bdae9d',
    drawerIcon: '#6a7d8a',
    red: '#1e9dff',
    mask: 'rgba(0,0,0,.8)',
    buttonMask: 'rgba(0,0,0,.2)',
    machineName: '#fdd4d7'
}

const standard = {
    theme: 'standard',
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
    _e0f1fb: '#e0f1fb',
    _f5fbff: '#f5fbff',
    d_493931: '#e0f1fb',
    d_9a836a: '#4b5862',
    hr: '#97a5af',
    placeholder: '#97a5af',
    meta: '#6a7d8a',
    borderColor: '#d1dfe8',
    loading: '#d3ecff',
    _fff: '#ffffff',
    _eee: '#eeeeee',
    addBtnBorderW: 0,
    addBtnBorderColor: 'transparent',
    drawerText: '#6a7d8a',
    drawerIcon: '#97a5af',
    red: '#F53240',
    mask: 'rgba(255,255,255,.8)',
    buttonMask: 'rgba(255,255,255,.2)',
    machineName: '#000e18'
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
