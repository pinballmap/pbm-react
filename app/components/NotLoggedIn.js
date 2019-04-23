import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
    StyleSheet, 
    Text, 
    View,
} from 'react-native'
import { PbmButton } from './'

class NotLoggedIn extends Component {
    render(){
        return(
            <View style={{flex: 1, backgroundColor:'#f5fbff'}}>
                <Text style={s.pageTitle}>{this.props.title}</Text>
                <Text style={s.hiya}>{this.props.text}</Text>
                <PbmButton
                    title={"Log In"} 
                    onPress={() => this.props.onPress()}
                    accessibilityLabel="Log In"
                />
            </View>
        )
    }
}

const s = StyleSheet.create({
    pageTitle: {
        fontSize: 14,
        textAlign: "center",
        fontWeight: "bold",
        paddingBottom: 15,
        paddingTop: 10
    },
    hiya: {
        fontStyle: 'italic',
        paddingHorizontal: 15,
        paddingBottom: 10,
        color: '#4b5862',
        textAlign: 'center'
    },
})

NotLoggedIn.propTypes = {
    navigation: PropTypes.object,
    text: PropTypes.string,
    title: PropTypes.string,
    onPress: PropTypes.func
}

export default NotLoggedIn

