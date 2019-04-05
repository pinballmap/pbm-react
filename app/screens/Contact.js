import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { 
    ActivityIndicator,
    StyleSheet, 
    TextInput, 
    View, 
} from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { 
    ConfirmationModal,
    HeaderBackButton,
    PbmButton,
    Text, 
} from '../components'
import {
    submitMessage, 
    clearMessage,
} from '../actions'

class Contact extends Component {
    state = {
        name: '', 
        email: '', 
        message: '',
    }
  
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'Contact',
            drawerIcon: () => <MaterialCommunityIcons name='email-outline' style={[s.drawerIcon]} />, 
            headerLeft: <HeaderBackButton navigation={navigation}/>,
            title: 'Contact',
            headerStyle: {
                backgroundColor:'#f5fbff',
                ...ifIphoneX({
                    paddingTop: 30,
                    height: 60
                }, {
                    paddingTop: 0
                })               
            },
            headerTintColor: '#4b5862'
        }
    }

    submit = () => {
        this.props.submitMessage(this.state)
    }

    acknowledgeConfirmation = () => {
        this.props.clearMessage()
        this.props.navigation.goBack()
    }

    _disabled = () => {
        const {name, email, message} = this.state
        if (this.props.user.loggedIn) {
            if (message) 
                return false
        } 
        else {
            if (name && email && message)
                return false
        }

        return true
    }
     
    render(){
        const { loggedIn, submittingMessage, confirmationMessage } = this.props.user

        return(
            <View style={{flex: 1,backgroundColor:'#f5fbff'}}>
                <ConfirmationModal visible={confirmationMessage.length > 0}>
                    <Text style={s.confirmText}>{confirmationMessage}</Text>
                    <View> 
                        <PbmButton
                            title={"Ok"}
                            onPress={() => this.acknowledgeConfirmation()}
                        />
                    </View>
                </ConfirmationModal>
                {submittingMessage ? 
                    <ActivityIndicator /> :
                    <View>
                        <Text>{`Have a question or a comment or a something that's a little bit inbetween?`}</Text>
                        {!loggedIn ?
                            <View>
                                <TextInput
                                    style={[{height: 40,textAlign:'center'},s.textInput]}
                                    underlineColorAndroid='transparent'
                                    onChangeText={name => this.setState({ name })}
                                    value={this.state.name}
                                    returnKeyType="done"
                                    placeholder={'Your name...'}
                                /> 
                                <TextInput
                                    style={[{height: 40,textAlign:'center'},s.textInput]}
                                    underlineColorAndroid='transparent'
                                    onChangeText={email => this.setState({ email })}
                                    value={this.state.email}
                                    returnKeyType="done"
                                    placeholder={'Your email...'}
                                /> 
                            </View>
                            : null}
                        <TextInput
                            multiline={true}
                            placeholder={'Tell us about it...'}
                            numberOfLines={10}
                            style={[{padding:5,height: 100},s.textInput]}
                            value={this.state.message}
                            onChangeText={message => this.setState({ message })}
                            textAlignVertical='top'
                            underlineColorAndroid='transparent'
                        />
                        <PbmButton 
                            title={'Submit'}
                            disabled={this._disabled()}
                            onPress={() => this.submit()}
                        />
                    </View>
                }
            </View>)
    }
}

const s = StyleSheet.create({ 
    drawerIcon: {
        fontSize: 24,
        color: '#6a7d8a'
    },
    textInput: {
        backgroundColor: '#ffffff', 
        borderColor: '#97a5af', 
        borderWidth: 2,
        height: 80,
        marginLeft:20,
        marginRight:20, 
        marginTop: 20,
        borderRadius: 5
    },
})

Contact.propTypes = {
    navigation: PropTypes.object,
    user: PropTypes.object,
    submitMessage: PropTypes.func,
    clearMessage: PropTypes.func,
}

const mapStateToProps = ({user}) => ({user})
const mapDispatchToProps = (dispatch) => ({
    submitMessage: state => dispatch(submitMessage(state)),
    clearMessage: () => dispatch(clearMessage())
})
export default connect(mapStateToProps, mapDispatchToProps)(Contact)