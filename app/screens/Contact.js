import React, { useContext, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
    ActivityIndicator,
    StyleSheet,
    TextInput,
    View,
} from 'react-native'
import { ThemeContext } from '../theme-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import {
    ConfirmationModal,
    HeaderBackButton,
    PbmButton,
    Screen,
    Text,
} from '../components'
import {
    submitMessage,
    clearMessage,
} from '../actions'

const Contact = ({ submitMessage, clearMessage, navigation, user }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const submit = () => {
        submitMessage({ name, email, message })
    }

    const acknowledgeConfirmation = () => {
        clearMessage()
        navigation.goBack()
    }

    const _disabled = () => {
        if (user.loggedIn) {
            if (message)
                return false
        }
        else {
            if (name && email && message)
                return false
        }

        return true
    }

    const { loggedIn, submittingMessage, confirmationMessage } = user

    return(
        <Screen keyboardDismissMode="on-drag">
            <ConfirmationModal visible={confirmationMessage.length > 0}>
                <Text style={s.confirmText}>{confirmationMessage}</Text>
                <View>
                    <PbmButton
                        title={"You bet!"}
                        onPress={acknowledgeConfirmation}
                        containerStyle={s.buttonContainer}
                    />
                </View>
            </ConfirmationModal>
            {submittingMessage ?
                <ActivityIndicator /> :
                <View style={{marginLeft:10,marginRight:10,marginTop:5}}>
                    <Text style={s.text}>{`We welcome all questions, comments, tips, app feedback, and whatever else!`}</Text>
                    {!loggedIn ?
                        <View>
                            <TextInput
                                style={[{height: 40},s.textInput]}
                                underlineColorAndroid='transparent'
                                onChangeText={name => setName(name)}
                                value={name}
                                returnKeyType="done"
                                placeholder={'Your name...'}
                                placeholderTextColor={theme.indigo4}
                                autoCorrect={false}
                            />
                            <TextInput
                                style={[{height: 40},s.textInput]}
                                underlineColorAndroid='transparent'
                                onChangeText={email => setEmail(email)}
                                value={email}
                                returnKeyType="done"
                                placeholder={'Your email...'}
                                placeholderTextColor={theme.indigo4}
                                keyboardType="email-address"
                                autoCorrect={false}
                            />
                        </View>
                        : null}
                    <TextInput
                        multiline={true}
                        placeholder={'Tell us about it...'}
                        placeholderTextColor={theme.indigo4}
                        numberOfLines={10}
                        style={[{padding:5,height: 200},s.textInput]}
                        value={message}
                        onChangeText={message => setMessage(message)}
                        textAlignVertical='top'
                        underlineColorAndroid='transparent'
                    />
                    <PbmButton
                        title={'Submit'}
                        disabled={_disabled()}
                        onPress={submit}
                    />
                </View>
            }
        </Screen>)
}

Contact.navigationOptions = ({ navigation, theme }) => ({
    drawerLabel: 'Contact',
    drawerIcon: () => <MaterialCommunityIcons name='email-outline' style={{ fontSize: 24, color: '#95867c'}} />,
    headerLeft: () => <HeaderBackButton navigation={navigation}/>,
    title: 'Contact',
    headerRight: () =><View style={{padding:6}}></View>,
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#1d1c1d' : '#fffbf5',
        borderBottomWidth: 0,
        elevation: 0,
        shadowColor: 'transparent'
    },
    headerTintColor: theme === 'dark' ? '#fdd4d7' : '#766a62',
    gestureEnabled: true
})

const getStyles = theme => StyleSheet.create({
    text: {
        fontSize: 16,
        lineHeight: 22,
        marginTop: 5,
        marginLeft: 15,
        marginRight: 15,
        fontWeight: '600',
        color: theme.text,
        textAlign: 'center'
    },
    textInput: {
        backgroundColor: theme.white,
        borderColor: theme.orange3,
        color: theme.text,
        borderWidth:1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        borderRadius: 10,
        paddingHorizontal: 5,
        textAlign: 'left'
    },
    confirmText: {
        textAlign: 'center',
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 18
    },
    buttonContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        marginBottom: 10
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
