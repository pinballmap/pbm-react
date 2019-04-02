import React from 'react'
import PropTypes from 'prop-types'
import { Keyboard } from 'react-native'
import { HeaderBackButton as HeaderBackButtonReactNavigation } from 'react-navigation'

const HeaderBackButton = ({navigation, title}) => 
    <HeaderBackButtonReactNavigation 
        tintColor="#4b5862"     
        onPress={() => {
            navigation.goBack(null)
            Keyboard.dismiss()
        }}
        title={title}
    />

HeaderBackButton.propTypes = {
    navigation: PropTypes.object,
    title: PropTypes.string,
}
    
export default HeaderBackButton
