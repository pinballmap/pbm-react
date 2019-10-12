import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Button, ThemeContext } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'

const DropDownButton = ({ title, onPress, }) => {
    const { theme } = useContext(ThemeContext)

    return(
        <Button
            title={title}
            onPress={onPress}
            buttonStyle={s(theme).dropdown}
            titleStyle={s(theme).titleStyle}
            style={{borderRadius: 10}}
            icon={<Ionicons name='md-arrow-dropdown' style={s(theme).dropdownIcon} />}
            iconRight
            containerStyle={{marginTop:5,marginRight:10,marginLeft:10}}
        />
    )
}

DropDownButton.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    accessibilityLabel: PropTypes.string,
    icon: PropTypes.node,
    disabled: PropTypes.bool,
}

const s = theme => StyleSheet.create({
    dropdown: {
        backgroundColor:"#e0ebf2",
        width: '100%',
        elevation: 0,
        borderColor: '#d1dfe8',
        borderWidth: 1,
        borderRadius: 10
    },
    dropdownIcon: {
        color: "#4b5862",
        fontSize: 32
    },
    titleStyle: {
        color:"#000e18",
        fontSize:16
    }
})

export default DropDownButton
