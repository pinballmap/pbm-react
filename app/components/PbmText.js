import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
    StyleSheet, 
    Text 
} from 'react-native'

class PbmText extends Component {
    render() {
        return (
            <Text style={[s.text, this.props.style]} onPress={this.props.onPress}>
                {this.props.children}
            </Text>
        )
    }
}

PbmText.propTypes = {
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    onPress: PropTypes.func, 
    children: PropTypes.node,
}

const s = StyleSheet.create({
    text: {
        color: "#000e18"
    },
})

export default PbmText
