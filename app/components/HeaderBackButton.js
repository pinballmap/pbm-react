import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Keyboard } from 'react-native'
import { ThemeContext } from 'react-native-elements'
import { HeaderBackButton as HeaderBackButtonReactNavigation } from 'react-navigation-stack'

const HeaderBackButton = ({navigation, title}) => {
    const { theme } = useContext(ThemeContext)

    return (
        <HeaderBackButtonReactNavigation 
            tintColor={theme.backButton}  
            onPress={() => {
                navigation.goBack(null)
                Keyboard.dismiss()
            }}
            title={title}
        />
    )
}

HeaderBackButton.propTypes = {
    navigation: PropTypes.object,
    title: PropTypes.string,
}
    
export default HeaderBackButton
