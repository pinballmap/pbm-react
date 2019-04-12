import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'

class DropDownButton extends Component {
    render(){
        return(
            <Button
                title={this.props.title}
                onPress={() => this.props.onPress()}
                buttonStyle={s.dropdown}
                titleStyle={{
                    color:"#000e18",
                    fontSize:16
                }}
                style={{borderRadius: 10}}
                icon={<Ionicons name='md-arrow-dropdown' style={s.dropdownIcon} />}
                iconRight
                containerStyle={{marginTop:5,marginRight:10,marginLeft:10}}
            />
        )
    }
}

DropDownButton.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    accessibilityLabel: PropTypes.string,
    icon: PropTypes.node,
    disabled: PropTypes.bool,
}

const s = StyleSheet.create({
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
    }
})

export default DropDownButton
