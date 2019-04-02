import React from 'react'
import PropTypes from 'prop-types'
import { HeaderBackButton as HeaderBackButtonReactNavigation } from 'react-navigation'
const DismissKeyboard = require('dismissKeyboard')

const HeaderBackButton = ({navigation, title}) => 
    <HeaderBackButtonReactNavigation 
        tintColor="#4b5862"     
        onPress={() => {
            navigation.goBack(null)
            DismissKeyboard()
        }}
        title={title}
    />

HeaderBackButton.propTypes = {
    navigation: PropTypes.object,
    title: PropTypes.string,
}
    
export default HeaderBackButton
