import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { 
    Platform,
    StyleSheet, 
} from 'react-native'
import { Button } from 'react-native-elements'
import { ThemeContext } from '../theme-context'

const WarningButton = ({ title, onPress, accessibilityLabel, }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    return(
        <Button
            title={title} 
            onPress={onPress}
            accessibilityLabel={accessibilityLabel}
            raised
            buttonStyle={s.redButton}
            titleStyle={s.titleStyle}    
            containerViewStyle={{alignSelf: 'stretch'}}
            containerStyle={[{overflow:'hidden'},s.margin15]}
        /> 
    )
}

WarningButton.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    accessibilityLabel: PropTypes.string,
}

const getStyles = (theme) => StyleSheet.create({
    margin15: {
        marginLeft: 40,
        marginRight: 40,
        marginTop: 15,
        marginBottom: 15
    },
    titleStyle: {
        fontSize: 18,
        color: theme.buttonTextColor,
        textTransform: 'capitalize',
        fontWeight: Platform.OS === 'ios' ? "500" : "400"
    },
    redButton: {
        backgroundColor: theme.warningButtonColor,
        width: '100%',
        elevation: 0
    },
})

export default WarningButton
