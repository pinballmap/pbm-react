import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'

class NotLoggedIn extends Component {
    render(){
        return(
            <View>
                <Text style={s.pageTitle}>{this.props.title}</Text>
                <Text style={s.hiya}>{this.props.text}</Text>
                <Button
                    title={"Login"} 
                    onPress={() => this.props.onPress()}
                    accessibilityLabel="Login"
                    raised
                    buttonStyle={s.blueButton}
                    titleStyle={s.titleStyle}
                    style={{borderRadius: 50}}
                    containerStyle={{borderRadius:50,marginTop:15,marginLeft:15,marginRight:15}}
                />
            </View>
        )
    }
}

const s = StyleSheet.create({
    blueButton: {
        backgroundColor:"#D3ECFF",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    pageTitle: {
        fontSize: 14,
        textAlign: "center",
        fontWeight: "bold",
        paddingBottom: 15,
        paddingTop: 10
    },
    hiya: {
        fontStyle: 'italic',
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
        color: '#444444',
        textAlign: 'center'
    },
    titleStyle: {
        color:"black",
        fontSize:18
    },
})

NotLoggedIn.propTypes = {
    navigation: PropTypes.object,
    text: PropTypes.string,
    title: PropTypes.string,
    onPress: PropTypes.func
}

export default NotLoggedIn

