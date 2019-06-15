import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
    Platform,
    StyleSheet, 
} from 'react-native'
import { Button } from 'react-native-elements'

class WarningButton extends Component {
    render(){
        return(
            <Button
                title={this.props.title} 
                onPress={() => this.props.onPress()}
                accessibilityLabel={this.props.accessibilityLabel}
                raised
                buttonStyle={s.redButton}
                titleStyle={s.titleStyle}    
                style={{borderRadius: 50}}
                containerViewStyle={{alignSelf: 'stretch'}}
                containerStyle={[{borderRadius:50},s.margin15]}
            /> 
        )
    }
}

WarningButton.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    accessibilityLabel: PropTypes.string,
}

const s = StyleSheet.create({
    margin15: {
        marginLeft:15,
        marginRight:15,
        marginTop:15,
        marginBottom:15
    },
    titleStyle: {
        fontSize:16,
        color:'#f53240',
        fontWeight: Platform.OS === 'ios' ? "500" : "400"
    },
    redButton: {
        backgroundColor: "#fdd4d7",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
})

export default WarningButton
