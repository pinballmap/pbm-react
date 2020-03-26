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
    pbmText:'#e6e6ff',
    machineName: '#D3ECFF',
    backButton: '#addbff',
    d_9a836a:'#a6a2a6',
    buttonTextColor:'#ebebeb',
    _6a7d8a:'#3f3c3f',
    meta:'#cac6ca',
    drawerText:'#ebebeb',
    drawerIcon:'#cac6ca',
    hr:'#cac6ca',
    placeholder:'#cac6ca',
    _97a5af:'#cac6ca',
    disabledText:'#5f595f',
    d_493931:'#5f595f',
    borderColor:'#736f73',
    buttonColor: '#576e80',
    loading:'#a6a2a6',
    _e0ebf2:'#595759',
    _e0f1fb:'#323038',
    _eee:'#323038',
    _f2f4f5:'#242226',
    findInput:'#242226',
    red: '#1e9dff',
    backgroundColor:'#1d1c1d',
    _f5fbff:'#cac6ca',
    warningButtonColor: '#805758',
    modalBg:'#000000',
    _fff:'#403e40',
    buttonMask: 'rgba(0,0,0,.2)',
    mask: 'rgba(0,0,0,.8)',
    addBtnBorderColor:'#736f73',
    addBtnBorderW:1,
    locationName: '#323038'
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
    disabledText: '#c1c9cf',
    _f2f4f5: '#f2f4f5',
    _6a7d8a: '#6a7d8a',
    _97a5af: '#97a5af',
    _e0ebf2: '#e0ebf2',
    _e0f1fb: '#e0f1fb',
    _f5fbff: '#f5fbff',
    d_493931: '#c1c9cf',
    d_9a836a: '#4b5862',
    hr: '#97a5af',
    placeholder: '#97a5af',
    meta: '#6a7d8a',
    findInput: '#f2f4f5',
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
    machineName: '#000e18',
    locationName: '#d3ecff'
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
