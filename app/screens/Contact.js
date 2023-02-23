import React, { useContext, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
    Keyboard,
    Platform,
    StyleSheet,
    TextInput,
    View,
} from 'react-native'
import { ThemeContext } from '../theme-context'
import {
    ActivityIndicator,
    ConfirmationModal,
    PbmButton,
    Screen,
    Text,
} from '../components'
import {
    submitMessage,
    clearMessage,
} from '../actions'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

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
    const keyboardDismissProp = Platform.OS === "ios" ? { keyboardDismissMode: "on-drag" } : { onScrollBeginDrag: Keyboard.dismiss }

    return (
        <Screen {...keyboardDismissProp}>
            <ConfirmationModal visible={confirmationMessage.length > 0}>
                <Text style={s.confirmText}>{confirmationMessage}</Text>
                <MaterialCommunityIcons
                    name='close-circle'
                    size={45}
                    onPress={acknowledgeConfirmation}
                    style={s.xButton}
                />
            </ConfirmationModal>
            {submittingMessage ?
                <ActivityIndicator /> :
                <KeyboardAwareScrollView {...keyboardDismissProp} enableResetScrollToCoords={false} style={s.background}>
                    <Text style={[s.text, s.blackText]}>{`We welcome all questions, comments, tips, app feedback, and whatever else!`}</Text>
                    <Text style={[s.text, s.pinkText]}>{`If you're writing to tell us that a location no longer has machines - NO NEED! Please just remove the machines from the location, and we will auto-delete it within a week.`}</Text>
                    <Text onPress={() => navigation.navigate('FAQ')} style={s.textLink}>{`Check the FAQ for other common questions.`}</Text>
                    {!loggedIn ?
                        <View>
                            <TextInput
                                style={[{ height: 40 }, s.textInput]}
                                underlineColorAndroid='transparent'
                                onChangeText={name => setName(name)}
                                returnKeyType="done"
                                placeholder={'Your name...'}
                                placeholderTextColor={theme.indigo4}
                                autoCorrect={false}
                            />
                            <TextInput
                                style={[{ height: 40 }, s.textInput]}
                                underlineColorAndroid='transparent'
                                onChangeText={email => setEmail(email)}
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
                        style={[{ padding: 5, height: 200 }, s.textInput]}
                        onChangeText={message => setMessage(message)}
                        textAlignVertical='top'
                        underlineColorAndroid='transparent'
                    />
                    <PbmButton
                        title={'Submit'}
                        disabled={_disabled()}
                        onPress={submit}
                    />
                </KeyboardAwareScrollView>
            }
        </Screen>)
}

const getStyles = theme => StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: theme.base1,
        marginHorizontal: 20,
        marginTop: 10
    },
    text: {
        fontSize: 16,
        lineHeight: 22,
        marginTop: 5,
        marginHorizontal: 15,
        fontFamily: 'boldFont',
    },
    textInput: {
        backgroundColor: theme.white,
        borderColor: theme.indigo4,
        color: theme.text,
        borderWidth: 1,
        marginTop: 20,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: 'left',
        fontFamily: 'regularFont',
        fontSize: 16
    },
    blackText: {
        color: theme.text,
    },
    pinkText: {
        color: theme.pink1,
        marginTop: 15,
    },
    textLink: {
        textDecorationLine: 'underline',
        fontSize: 16,
        lineHeight: 22,
        marginTop: 15,
        marginHorizontal: 15,
        fontFamily: 'regularFont'
    },
    confirmText: {
        textAlign: 'center',
        marginLeft: 15,
        marginRight: 15,
        fontSize: 18,
        color: theme.purple,
        fontFamily: 'boldFont'
    },
    xButton: {
        position: 'absolute',
        right: -20,
        top: -20,
        color: theme.red2,
    },
})

Contact.propTypes = {
    navigation: PropTypes.object,
    user: PropTypes.object,
    submitMessage: PropTypes.func,
    clearMessage: PropTypes.func,
}

const mapStateToProps = ({ user }) => ({ user })
const mapDispatchToProps = (dispatch) => ({
    submitMessage: state => dispatch(submitMessage(state)),
    clearMessage: () => dispatch(clearMessage())
})
export default connect(mapStateToProps, mapDispatchToProps)(Contact)
