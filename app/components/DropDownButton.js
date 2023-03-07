import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Button } from '@rneui/base'
import { MaterialIcons } from '@expo/vector-icons'
import { ThemeContext } from '../theme-context'

const DropDownButton = ({ title, onPress, containerStyle }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    return (
        <Button
            title={title}
            onPress={onPress}
            buttonStyle={s.dropdown}
            titleStyle={s.titleStyle}
            uppercase={false}
            icon={<MaterialIcons name='arrow-drop-down' style={s.dropdownIcon} />}
            iconPosition="right"
            containerStyle={[{ overflow: 'visible', borderRadius: 25, backgroundColor: theme.base1, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 6, elevation: 6 }, containerStyle ? containerStyle : s.containerMargin]}
        />
    )
}

const getStyles = (theme) => StyleSheet.create({
    dropdown: {
        backgroundColor: theme.base3,
        width: '100%',
        borderRadius: 25,
        height: 40,
    },
    containerMargin: {
        marginTop: 5,
        marginHorizontal: 10,
    },
    dropdownIcon: {
        color: theme.text3,
        fontSize: 32,
        marginLeft: 5,
        marginTop: -3,
    },
    titleStyle: {
        color: theme.text3,
        fontSize: 16,
        fontFamily: 'regularFont'
    }
})

DropDownButton.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    accessibilityLabel: PropTypes.string,
    icon: PropTypes.node,
    disabled: PropTypes.bool,
    containerStyle: PropTypes.array,
}

export default DropDownButton
