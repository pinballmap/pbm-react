import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text } from 'react-native'

class PbmText extends Component {
    render() {
        return (
            <Text style={[s.text, this.props.style]}>
                {this.props.children}
            </Text>
        )
    }
}

PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
])

const s = StyleSheet.create({
    text: {
        color: "#000e18"
    },
})

export default PbmText
