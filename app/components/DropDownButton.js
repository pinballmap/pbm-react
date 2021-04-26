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
            icon={<MaterialIcons name='arrow-drop-down' style={s.dropdownIcon} />}
            iconRight
            containerStyle={s.containerStyle}
        />
    )
}

const getStyles = (theme) => StyleSheet.create({
    dropdown: {
        backgroundColor: theme.white,
        width: '100%',
        borderRadius: 25,
        height: 40,
    },
    containerStyle: {
        marginTop:5,
        marginRight:10,
        marginLeft:10,
        borderRadius:25,
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 5,
        overflow: 'visible'
    },
    dropdownIcon: {
        color: theme.orange8,
        fontSize: 32,
        marginLeft: 5,
        marginTop: -3
    },
    titleStyle: {
        color: theme.orange8,
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
