import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import {
    Platform,
    StyleSheet,
} from 'react-native'
import { Button } from 'react-native-elements'
import { ThemeContext } from '../theme-context'

const WarningButton = ({ title, onPress, accessibilityLabel, containerStyle }) => {
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
            containerStyle={[{overflow:'hidden',borderRadius: 25,}, containerStyle ? containerStyle : s.margin15]}
        />
    )
}

WarningButton.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    accessibilityLabel: PropTypes.string,
    containerStyle: PropTypes.object,
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
        color: 'white',
        textTransform: 'capitalize',
        fontWeight: Platform.OS === 'ios' ? "600" : "500"
    },
    redButton: {
        backgroundColor: theme.red2,
        width: '100%',
        borderRadius: 25,
        shadowColor: '#dcd3d6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 5,
    },
})

export default WarningButton
