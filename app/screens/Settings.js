import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { 
    Dimensions,
    StyleSheet, 
    View, 
} from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import { ThemeContext } from '../theme-context'
import { Screen, Text } from '../components'
import { MaterialIcons } from '@expo/vector-icons'
import { HeaderBackButton } from '../components'

let deviceWidth = Dimensions.get('window').width

const Settings = () => {
    const { toggleTheme, theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    useEffect(() => {
        let isCancelled = false

        // retrieveItem('themePreference')
        //     .then(recentSearchHistory => recentSearchHistory ? this.setState({ recentSearchHistory }) : this.setState({ recentSearchHisotry : [] }))
        //     .catch(() => this.setState({ recentSearchHisotry : [] }))

        return () => {
            isCancelled = true
        }
    }, [])

    updateDefaultPref = (idx) => {
        console.log(idx)
        toggleTheme()
    }

    updateDarkPref = (idx) => {
        console.log(idx)
        toggleTheme()
    }
     
    return(
        <Screen>
            <Text>Default OS Theme</Text>
            <Text>Select Dark to Override Default App Theme</Text>
            <ButtonGroup style={s.border}
                onPress={this.updateDefaultPref}
                selectedIndex={0}
                buttons={['Standard', 'Dark']}
                containerStyle={s.buttonGroupContainer}
                textStyle={s.textStyle}
                selectedButtonStyle={s.selButtonStyle}
                selectedTextStyle={s.selTextStyle}
                innerBorderStyle={s.innerBorderStyle}
            />
            <Text>Dark OS Theme</Text>
            <Text>Select Standard to Override Default Dark Theme</Text>
            <ButtonGroup style={s.border}
                onPress={this.updateDarkPref}
                selectedIndex={1}
                buttons={['Standard', 'Dark']}
                containerStyle={s.buttonGroupContainer}
                textStyle={s.textStyle}
                selectedButtonStyle={s.selButtonStyle}
                selectedTextStyle={s.selTextStyle}
                innerBorderStyle={s.innerBorderStyle}
            />
        </Screen>
    )

}

Settings.navigationOptions = ({ navigation, theme }) => ({
    drawerLabel: 'Settings',
    drawerIcon: () => <MaterialIcons name='info-outline' style={{ fontSize: 24, color: '#6a7d8a' }} />,
    headerLeft: <HeaderBackButton navigation={navigation} />,
    title: 'Settings',
    headerRight:<View style={{padding:6}}></View>,
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#2a211c' : '#f5fbff',
    },
    headerTintColor: theme === 'dark' ? '#fdd4d7' : '#4b5862',
    headerTitleStyle: {
        textAlign: 'center', 
        flex: 1
    },
    gesturesEnabled: true
})

const getStyles = theme => StyleSheet.create({
    border: {
        borderWidth: 2,
        borderColor: theme.borderColor,
    },
    selButtonStyle: {
        backgroundColor: theme.loading,
    },
    buttonGroupContainer: {
        height: 40,
        borderColor: theme.borderColor,
        borderWidth: 2,
        backgroundColor: theme._e0ebf2,
    },
    innerBorderStyle: {
        width: 1,
        color: theme.placeholder
    },
    textStyle: {
        color: theme.pbmText
    },
})

Settings.propTypes = {
    navigation: PropTypes.object,
}

export default Settings
