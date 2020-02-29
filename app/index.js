import { registerRootComponent } from 'expo'
import { Appearance } from 'react-native-appearance'
import React, { Component } from 'react'
import { Platform, StatusBar } from 'react-native'
import { ThemeProvider } from 'react-native-elements'
import { ThemeContext } from './theme-context'
import { Provider } from 'react-redux'
import { PbmStack } from './config/router'
import { dark, standard } from './utils/themes'

import store from './store'

const defaultTheme = Appearance.getColorScheme()

class App extends Component {
    constructor(props) {
        super(props)

        this.toggleTheme = () => {
            this.setState(state => ({
              selectedTheme: state.selectedTheme === 'dark' ? '' : 'dark'
            }));
          };
        
        this.state={ selectedTheme: defaultTheme  }
    }

    componentDidMount() {
        StatusBar.setBarStyle('dark-content')

        if (Platform.OS === 'android') {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor('transparent')
        }
    }
 
    render() {
        const { selectedTheme } = this.state
     
        return (
            <ThemeContext.Provider value={{toggleTheme: this.toggleTheme,  theme: selectedTheme === 'dark' ? dark : standard }}>
                <Provider store={store}>
                    <PbmStack theme={selectedTheme} />
                </Provider>
            </ThemeContext.Provider>
        )
    }
}

export default registerRootComponent(App)
