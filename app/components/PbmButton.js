import React from 'react'
import PropTypes from 'prop-types'
import { Appearance, useColorScheme } from 'react-native-appearance'
import { 
    Platform,
    StyleSheet, 
} from 'react-native'
import { Button } from 'react-native-elements'

Appearance.getColorScheme()

const PbmButton = ({title, accessibilityLabel, buttonStyle, containerStyle, onPress, icon, disabled}) => {
    let colorScheme = useColorScheme()

    return (
        <Button
            title={title}
            onPress={onPress}
            accessibilityLabel={accessibilityLabel}
            icon={icon}
            disabled={disabled}
            raised
            buttonStyle={buttonStyle ? buttonStyle : colorScheme === 'dark' ? s.darkButton : s.blueButton}
            titleStyle={colorScheme === 'dark' ? s.darkTitleStyle : s.titleStyle}
            style={{borderRadius: 50}}
            containerViewStyle={{alignSelf: 'stretch'}}
            containerStyle={[{borderRadius:50}, containerStyle ? containerStyle : s.margin15]}
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

const s = StyleSheet.create({
    blueButton: {
        backgroundColor:"#D3ECFF",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    darkButton: {
        backgroundColor:"#000",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    titleStyle: {
        color:"#4b5862",
        fontSize:16,
        fontWeight: Platform.OS === 'ios' ? "500" : "400"
    },
    darkTitleStyle: {
        color:"#FFF",
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
