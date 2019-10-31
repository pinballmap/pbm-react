import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { 
    Platform,
    StyleSheet, 
} from 'react-native'
import { Button, ThemeContext } from 'react-native-elements'

const PbmButton = ({title, accessibilityLabel, buttonStyle, containerStyle, onPress, icon, disabled}) => {
    const { theme } = useContext(ThemeContext)
    const styles = getStyles(theme)

    return (
        <Button
            title={title}
            onPress={onPress}
            accessibilityLabel={accessibilityLabel}
            icon={icon}
            disabled={disabled}
            disabledStyle={styles.disabledStyle}
            disabledTitleStyle={styles.disabledTitleStyle}
            raised
            buttonStyle={buttonStyle ? buttonStyle : styles.blueButton}
            titleStyle={styles.titleStyle}
            style={{borderRadius: 50}}
            containerViewStyle={{alignSelf: 'stretch'}}
            containerStyle={[{borderRadius:50}, containerStyle ? containerStyle : styles.margin15]}
        />
    )
}

const getStyles = (theme) => StyleSheet.create({
    blueButton: {
        backgroundColor: theme.buttonColor,
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    titleStyle: {
        color: theme.buttonTextColor,
        fontSize: 16,
        fontWeight: Platform.OS === 'ios' ? "500" : "400"
    },
    disabledStyle: {
        backgroundColor: theme._e0f1fb
    },
    disabledTitleStyle: {
        color: theme._f2f4f5
    },
    margin15: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        marginBottom: 15
    },
})

PbmButton.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    accessibilityLabel: PropTypes.string,
    icon: PropTypes.node,
    disabled: PropTypes.bool,
    buttonStyle: PropTypes.object,
    containerStyle: PropTypes.object,
}

export default PbmButton
