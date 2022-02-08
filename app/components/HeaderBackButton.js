import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Keyboard } from 'react-native'
import { HeaderBackButton as HeaderBackButtonReactNavigation } from 'react-navigation-stack'
import { ThemeContext } from '../theme-context'

const HeaderBackButton = ({navigation, title}) => {
    const { theme } = useContext(ThemeContext)

    return (
        <HeaderBackButtonReactNavigation
            tintColor={theme.pink1}
            onPress={() => {
                navigation.goBack(null)
                Keyboard.dismiss()
            }}
            labelVisible={false}
            title={title}
        />
    )
}

HeaderBackButton.propTypes = {
    navigation: PropTypes.object,
    title: PropTypes.string,
}

export default HeaderBackButton
