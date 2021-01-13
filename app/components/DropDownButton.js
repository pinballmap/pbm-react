import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'
import { ThemeContext } from '../theme-context'

const DropDownButton = ({ title, onPress, }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    return(
        <Button
            title={title}
            onPress={onPress}
            buttonStyle={s.dropdown}
            titleStyle={s.titleStyle}
            style={{borderRadius: 5}}
            icon={<MaterialIcons name='arrow-drop-down' style={s.dropdownIcon} />}
            iconRight
            containerStyle={{marginTop:5,marginRight:10,marginLeft:10}}
        />
    )
}

const getStyles = (theme) => StyleSheet.create({
    dropdown: {
        backgroundColor: theme.textInput,
        width: '100%',
        elevation: 0,
        borderColor: theme.borderColor,
        borderWidth: 1,
        borderRadius: 5,
        height: 40
    },
    dropdownIcon: {
        color: theme.dropdownText,
        fontSize: 32,
        marginLeft: 5,
        marginTop: -3
    },
    titleStyle: {
        color: theme.dropdownText,
        textTransform: 'capitalize',
        fontSize: 16
    }
})

DropDownButton.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    accessibilityLabel: PropTypes.string,
    icon: PropTypes.node,
    disabled: PropTypes.bool,
}

export default DropDownButton
