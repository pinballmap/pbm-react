import { registerRootComponent } from 'expo'
import React, { useState, useEffect } from 'react'
import { Appearance } from 'react-native'
import { retrieveItem } from './config/utils'
import { ThemeContext } from './theme-context'
import { Provider } from 'react-redux'
import { PbmStack } from './config/router'
import { dark, standard } from './utils/themes'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

import store from './store'

const defaultTheme = Appearance.getColorScheme()

const App = () => {
    const [selectedTheme, setSelectedTheme] = useState(defaultTheme === 'dark' ? 'dark' : '')

    useEffect(() => {
        retrieveItem('defaultThemeOverride')
            .then(defaultThemeOverride => defaultTheme !== 'dark' && defaultThemeOverride && setSelectedTheme('dark'))

        retrieveItem('darkThemeOverride')
            .then(darkThemeOverride => defaultTheme === 'dark' && darkThemeOverride && setSelectedTheme(''))

    }, [])

    const toggleDefaultTheme = () => defaultTheme !== 'dark' && setSelectedTheme(selectedTheme === 'dark' ? '' : 'dark')
    const toggleDarkTheme = () => defaultTheme === 'dark' && setSelectedTheme(selectedTheme === 'dark' ? '' : 'dark')

    return (
        <SafeAreaProvider>
            <ThemeContext.Provider value={{
                toggleDefaultTheme,
                toggleDarkTheme,
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

export default registerRootComponent(App)
