import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
    AsyncStorage,
    StyleSheet,
    View,
} from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import { ThemeContext } from '../theme-context'
import { Screen, Text } from '../components'
import { MaterialIcons } from '@expo/vector-icons'
import { HeaderBackButton } from '../components'
import { retrieveItem } from '../config/utils'

const Settings = () => {
    const { toggleDefaultTheme, toggleDarkTheme, theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    const [selectedDefault, updateSelectedDefault] = useState(0)
    const [selectedDark, updateSelectedDark] = useState(1)

    useEffect(() => {
        retrieveItem('defaultThemeOverride')
            .then(defaultThemeOverride => defaultThemeOverride && updateSelectedDefault(1))

        retrieveItem('darkThemeOverride')
            .then(darkThemeOverride => darkThemeOverride && updateSelectedDark(0))
    })

    const updateDefaultPref = (idx) => {
        if (idx === selectedDefault)
            return

        updateSelectedDefault(idx)
        AsyncStorage.setItem('defaultThemeOverride', JSON.stringify(idx === 1))
        toggleDefaultTheme()
    }

    const updateDarkPref = (idx) => {
        if (idx === selectedDark)
            return

        updateSelectedDark(idx)
        AsyncStorage.setItem('darkThemeOverride', JSON.stringify(idx === 0))
        toggleDarkTheme()
    }

    return(
        <Screen>
            <View style={s.background}>
                <View style={s.pageTitle}><Text style={s.pageTitleText}>Standard Theme</Text></View>
                <ButtonGroup style={s.border}
                    onPress={updateDefaultPref}
                    selectedIndex={selectedDefault}
                    buttons={['Standard', 'Dark']}
                    containerStyle={s.buttonGroupContainer}
                    textStyle={s.buttonGroupInactive}
                    selectedButtonStyle={s.selButtonStyle}
                    selectedTextStyle={s.selTextStyle}
                    innerBorderStyle={s.innerBorderStyle}
                />
                <Text style={s.text}>{`When your phone is in Light Mode, use the default ("Standard") or select "Dark" to use our Dark Mode theme.`}</Text>
                <View style={s.pageTitle}><Text style={s.pageTitleText}>Dark Mode Theme</Text></View>
                <ButtonGroup style={s.border}
                    onPress={updateDarkPref}
                    selectedIndex={selectedDark}
                    buttons={['Standard', 'Dark']}
                    containerStyle={s.buttonGroupContainer}
                    textStyle={s.buttonGroupInactive}
                    selectedButtonStyle={s.selButtonStyle}
                    selectedTextStyle={s.selTextStyle}
                    innerBorderStyle={s.innerBorderStyle}
                />
                <Text style={s.text}>{`When your phone is in Dark Mode, use the default ("Dark") or select "Standard" to use our Light Mode theme.`}</Text>
            </View>
        </Screen>
    )

}

Settings.navigationOptions = ({ navigation, theme }) => ({
    drawerLabel: 'Settings',
    drawerIcon: () => <MaterialIcons name='info-outline' style={{ fontSize: 24, color: '#95867c' }} />,
    headerLeft: <HeaderBackButton navigation={navigation} />,
    title: 'Settings',
    headerRight:<View style={{padding:6}}></View>,
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#1d1c1d' : '#fff7eb',
    },
    headerTintColor: theme === 'dark' ? '#fdd4d7' : '#766a62',
    headerTitleStyle: {
        textAlign: 'center',
        flex: 1
    },
    gesturesEnabled: true
})

const getStyles = theme => StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: theme.neutral
    },
    pageTitle: {
        paddingVertical: 10,
        backgroundColor: theme.orange7,
        marginBottom: 10
    },
    pageTitleText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: "bold",
        color: theme.neutral
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        padding: 10,
        color: theme.text,
        backgroundColor: theme.blue1,
        textAlign: 'center'
    },
    text: {
        fontSize: 14,
        color: theme.orange7,
        fontStyle: 'italic',
        lineHeight: 22,
        marginBottom: 15,
        marginLeft: 15,
        marginRight: 15,
    },
    border: {
        borderWidth: 2,
        borderColor: theme.orange3,
    },
    buttonGroupContainer: {
        height: 40,
        borderColor: theme.blue2,
        borderWidth: 2,
        backgroundColor: theme.buttonGroup,
    },
    buttonGroupInactive: {
        color: '#736f73'
    },
    innerBorderStyle: {
        width: 1,
        color: theme.blue2
    },
    selButtonStyle: {
        backgroundColor: theme.white,
    },
    selTextStyle: {
        color: theme.orange8,
        fontWeight: 'bold',
    },
})

Settings.propTypes = {
    navigation: PropTypes.object,
}

export default Settings
