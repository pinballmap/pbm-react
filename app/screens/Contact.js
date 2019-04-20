import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { 
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet, 
    TextInput, 
    View,
} from 'react-native'
import { Constants } from 'expo'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
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
                height: Expo.Constants.statusBarHeight > 40 ? 60 : Platform.OS === 'android' ? 56 : Platform.OS === 'ios' ? 44 : null, 
                paddingTop: Expo.Constants.statusBarHeight > 40 ? 30 : '',                
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
            <ScrollView keyboardDismissMode="on-drag" style={{flex: 1,backgroundColor:'#f5fbff'}}>
                <ConfirmationModal visible={confirmationMessage.length > 0}>
                    <Text style={s.confirmText}>{confirmationMessage}</Text>
                    <View> 
                        <PbmButton
                            title={"You bet!"}
                            onPress={() => this.acknowledgeConfirmation()}
                        />
                    </View>
                </ConfirmationModal>
                {submittingMessage ? 
                    <ActivityIndicator /> :
                    <View style={{marginLeft:10,marginRight:10,marginTop:5}}>
                        <Text>{`Have a question, comment, or tip? We are here for you.`}</Text>
                        {!loggedIn ?
                            <View>
                                <TextInput
                                    style={[{height: 40},s.textInput]}
                                    underlineColorAndroid='transparent'
                                    onChangeText={name => this.setState({ name })}
                                    value={this.state.name}
                                    returnKeyType="done"
                                    placeholder={'Your name...'}
                                /> 
                                <TextInput
                                    style={[{height: 40},s.textInput]}
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
                            style={[{padding:5,height: 200},s.textInput]}
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
            </ScrollView>)
    }
}

const s = StyleSheet.create({ 
    drawerIcon: {
        fontSize: 24,
        color: '#6a7d8a'
    },
    textInput: {
        backgroundColor: '#e0ebf2', 
        borderColor: '#d1dfe8',
        borderWidth:1,
        marginLeft: 10,
        marginRight: 10, 
        marginTop: 20,
        borderRadius: 10,
        paddingLeft: 5,
        paddingRight: 5,
        textAlign: 'left'
    },
    confirmText: {
        textAlign: 'center',
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 18
    }
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