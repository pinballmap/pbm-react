import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Dimensions } from 'react-native'
import { Button } from 'react-native-elements'

let deviceWidth = Dimensions.get('window').width

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
                containerStyle={[{borderRadius:50},deviceWidth > 400 ? s.margin25 : s.margin15]}
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
    margin25: {
        marginLeft:25,
        marginRight:25,
        marginTop:15,
        marginBottom:15
    },
    redButton: {
        backgroundColor: "#fdd4d7",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
})

export default WarningButton
