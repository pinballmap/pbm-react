/* eslint-disable react-native/no-unused-styles */
import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { 
    Platform,
    StyleSheet, 
} from 'react-native'
import { Button, ThemeContext } from 'react-native-elements'

const PbmButton = ({title, accessibilityLabel, buttonStyle, containerStyle, onPress, icon, disabled}) => {
    const { theme } = useContext(ThemeContext)

    return (
        <Button
            title={title}
            onPress={onPress}
            accessibilityLabel={accessibilityLabel}
            icon={icon}
            disabled={disabled}
            raised
            buttonStyle={buttonStyle ? buttonStyle : styles(theme).blueButton}
            titleStyle={styles(theme).titleStyle}
            style={{borderRadius: 50}}
            containerViewStyle={{alignSelf: 'stretch'}}
            containerStyle={[{borderRadius:50}, containerStyle ? containerStyle : styles(theme).margin15]}
        />
    )
}

PbmButton.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    accessibilityLabel: PropTypes.string,
    icon: PropTypes.node,
    disabled: PropTypes.bool,
    buttonStyle: PropTypes.object,
    containerStyle: PropTypes.object,
}

const styles = theme => StyleSheet.create({
    blueButton: {
        backgroundColor: theme.buttonColor,
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    titleStyle: {
        color: theme.textColor,
        fontSize:16,
        fontWeight: Platform.OS === 'ios' ? "500" : "400"
    },
    margin15: {
        marginLeft:15,
        marginRight:15,
        marginTop:15,
        marginBottom:15
    },
})

export default PbmButton
