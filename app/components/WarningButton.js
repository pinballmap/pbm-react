import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
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
                titleStyle={{fontSize:18,color:'#f53240'}}    
                style={{borderRadius: 50}}
                containerStyle={[{borderRadius:50}, s.margin10]}
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
    margin10: {
        marginLeft:10,
        marginRight:10,
        marginTop:10,
        marginBottom:10
    },
    redButton: {
        backgroundColor: "#fdd4d7",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
})

export default WarningButton
