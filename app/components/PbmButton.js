import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
    StyleSheet, 
} from 'react-native'
import { Button } from 'react-native-elements'

class PbmButton extends Component {
    render(){
        return(
            <Button
                title={this.props.title}
                onPress={() => this.props.onPress()}
                accessibilityLabel={this.props.accessibilityLabel}
                icon={this.props.icon}
                disabled={this.props.disabled}
                raised
                buttonStyle={this.props.buttonStyle ? this.props.buttonStyle : s.blueButton}
                titleStyle={s.titleStyle}
                style={{borderRadius: 50}}
                containerViewStyle={{alignSelf: 'stretch'}}
                containerStyle={[{borderRadius:50},this.props.containerStyle ? this.props.containerStyle : s.margin15]}
            />
        )
    }
}

PbmButton.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    accessibilityLabel: PropTypes.string,
    icon: PropTypes.node,
    disabled: PropTypes.bool,
}

const s = StyleSheet.create({
    blueButton: {
        backgroundColor:"#D3ECFF",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    titleStyle: {
        color:"#4b5862",
        fontSize:18
    },
    margin15: {
        marginLeft:15,
        marginRight:15,
        marginTop:15,
        marginBottom:15
    },
})

export default PbmButton
