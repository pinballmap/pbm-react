import { registerRootComponent } from 'expo'
import React, { Component } from 'react'
import { Appearance, Platform } from 'react-native'
import { retrieveItem } from './config/utils'
import { ThemeContext } from './theme-context'
import { Provider } from 'react-redux'
import { PbmStack } from './config/router'
import { dark, standard } from './utils/themes'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar';

import store from './store'

const defaultTheme = Appearance.getColorScheme()

class App extends Component {
    constructor(props) {
        super(props)

        this.toggleDefaultTheme = () => {
            defaultTheme !== 'dark' && this.setState(state => ({
                selectedTheme: state.selectedTheme === 'dark' ? '' : 'dark'
            }))
        }

        this.toggleDarkTheme = () => {
            defaultTheme === 'dark' && this.setState(state => ({
                selectedTheme: state.selectedTheme === 'dark' ? '' : 'dark'
            }))
        }

        this.state={ selectedTheme: defaultTheme }
    }

    componentDidMount() {

        retrieveItem('defaultThemeOverride')
            .then(defaultThemeOverride => defaultTheme !== 'dark' && defaultThemeOverride && this.setState({selectedTheme: 'dark'}))

        retrieveItem('darkThemeOverride')
            .then(darkThemeOverride => defaultTheme === 'dark' && darkThemeOverride && this.setState({selectedTheme: ''}))
    }

    render() {
        const { selectedTheme } = this.state

        return (
            <SafeAreaProvider>
                <ThemeContext.Provider value={{
                    toggleDefaultTheme: this.toggleDefaultTheme,
                    toggleDarkTheme: this.toggleDarkTheme,
                    theme: selectedTheme === 'dark' ? dark : standard
                }}>
                    <Provider store={store}>
                        <PbmStack theme={selectedTheme === 'dark' ? 'dark' : 'light'} />
                    </Provider>
                </ThemeContext.Provider>
                <StatusBar style={selectedTheme === 'dark' ? 'light' : 'dark'} translucent={true} />
            </SafeAreaProvider>
        )
    }
}

export default registerRootComponent(App)
