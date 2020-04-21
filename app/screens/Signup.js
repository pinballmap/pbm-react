import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
    Dimensions, 
    ImageBackground, 
    Keyboard,
    StyleSheet, 
    Text, 
    TouchableWithoutFeedback, 
    View, 
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { 
    Button, 
    Input,
} from 'react-native-elements'
import { ThemeContext } from '../theme-context'
import { login, loginLater } from '../actions/user_actions'
import { postData } from '../config/request'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

let deviceHeight = Dimensions.get('window').height

const Signup = ({ login, loginLater, navigation }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    const [username, setUsername] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirm_password, setConfirmPassword] = useState(null)
    const [usernameError, setUsernameError] = useState(null)
    const [emailError, setEmailError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)
    const [confirm_passwordError, setConfirmPasswordError] = useState(null)
    const [errors, setErrors] = useState(false)
    const [apiErrorMsg, setApiErrorMsg] = useState(null)

    const validateFields = () => {
        if (!username) {
            setUsernameError('EMPTY USERNAME')
            setErrors(true)
        } else if (username.length > 15) {
            setUsernameError('Username is too long (maximum is 15 characters')
            setErrors(true)
        } else if (!(/^[a-zA-Z0-9_.]*$/).test(username)) {
            setErrors(true)
            setUsernameError('Username must be alphanumeric')
        }

        if (!email) {
            setEmailError('EMPTY EMAIL')
            setErrors(true)
        } else if (!email.includes('@')) {
            setEmailError('Email is invalid')
            setErrors(true)
        }

        if (!password) {
            setPasswordError('EMPTY PASSWORD')
            setErrors(true)
        } else if (password.length < 6) {
            setPasswordError('Password is too short (minimum is 6 characters)')
            setErrors(true)
        }

        if (password !== confirm_password) {
            setConfirmPasswordError("DOESN'T MATCH PASSWORD")
            setErrors(true) 
        }
    }

    const submit = () => {
        // Reset error states upon a submission / resubmission
        setUsernameError(null)
        setEmailError(null)
        setPasswordError(null)
        setConfirmPasswordError(null)
        setApiErrorMsg(null)
        setErrors(false)

        validateFields()

        if(!errors) {
            const body = {
                username,
                email,
                password,
                confirm_password,
            }

            postData('/users/signup.json', body)
                .then(data => {
                    // Something goes wrong with the API request
                    if (data.message) {
                        setApiErrorMsg(data.message)
                        setErrors(true)
                    }
        
                    if (data.errors) {
                        setErrors(true)
                        const errors = data.errors.split(",")

                        if (errors.indexOf('Username is invalid') > -1) {
                            setUsernameError('Username is invalid')
                        }

                        if (errors.indexOf('Username has already been taken') > -1) {
                            setUsernameError('Username has already been taken')
                        }

                        if (errors.indexOf('Email is invalid') > -1) {
                            setEmailError('Email is invalid')
                        }
                    }

                    if (data.user) {      
                        login(data.user)
                        navigation.navigate('Map')
                    }
                })
                .catch(err => {
                    setErrors(true)
                    setApiErrorMsg(err)
                })
        }
    }

    return (
        <KeyboardAwareScrollView keyboardDismissMode="on-drag" enableResetScrollToCoords={false} keyboardShouldPersistTaps="handled">
            <ImageBackground source={require('../assets/images/t-shirt-logo.png')} style={s.backgroundImage}>
                <View style={s.mask}>
                    <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>
                        <View style={s.justify}>
                            {errors && 
                                <Text style={s.errorText}>
                                    {apiErrorMsg ? apiErrorMsg : 'There were errors trying to process your submission'}
                                </Text>
                            }
                            <Text style={s.bold}>Sign Up</Text>
                            <Input 
                                placeholder='Username'
                                placeholderTextColor={theme.placeholder}
                                leftIcon={<MaterialIcons name='face' style={s.iconStyle} />}
                                onChangeText={username => setUsername(username)}
                                value={username}
                                errorStyle={{ color : 'red' }}
                                errorMessage={usernameError}
                                inputContainerStyle={s.inputBox}
                                inputStyle={s.inputText}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <Input 
                                placeholder="Email Address"
                                placeholderTextColor={theme.placeholder}
                                leftIcon={<MaterialCommunityIcons name='email-outline' style={s.iconStyle} />}
                                onChangeText={email => setEmail(email)}
                                value={email}
                                errorStyle={{ color : 'red' }}
                                errorMessage={emailError}
                                inputContainerStyle={s.inputBox}
                                inputStyle={s.inputText}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                            />
                            <Input 
                                placeholder="Password"
                                placeholderTextColor={theme.placeholder}
                                leftIcon={<MaterialIcons name='lock-outline' style={s.iconStyle} />}
                                onChangeText={password => setPassword(password)}
                                value={password}
                                errorStyle={{ color : 'red' }}
                                errorMessage={passwordError}
                                inputContainerStyle={s.inputBox}
                                inputStyle={s.inputText}
                                secureTextEntry = {true}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <Input 
                                placeholder="Confirm Password"
                                placeholderTextColor={theme.placeholder}
                                leftIcon={<MaterialIcons name='lock-outline' style={s.iconStyle} />}
                                onChangeText={confirm_password => setConfirmPassword(confirm_password)}
                                value={confirm_password}
                                errorStyle={{ color : 'red' }}
                                errorMessage={confirm_passwordError}
                                inputContainerStyle={s.inputBox}
                                inputStyle={s.inputText}
                                secureTextEntry = {true}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <Button
                                onPress={submit}
                                raised
                                buttonStyle={s.buttonStyle}
                                titleStyle={s.buttonTitle}
                                containerStyle={{marginLeft:10,marginRight:10,marginTop: 15,marginBottom: 25,borderRadius:50,overflow:'hidden'}}
                                style={{borderRadius: 50}}
                                rounded
                                title="Sign Up"
                                accessibilityLabel="Sign Up"
                                disabled={!username || !email || !password || !confirm_password}
                                disabledStyle={s.disabledStyle}
                                disabledTitleStyle={s.disabledTitleStyle}
                            />
                            <Button
                                onPress={() => navigation.navigate('Login')}
                                titleStyle={s.textLink}
                                containerStyle={{marginBottom: 15}}
                                buttonStyle={s.buttonMask}
                                title="Already a user? LOG IN!"
                            />
                            <Button
                                onPress={() => {
                                    loginLater()
                                    navigation.navigate('Map')
                                }} 
                                titleStyle={s.textLink}
                                buttonStyle={s.buttonMask}
                                title="skip signing up for now"
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </ImageBackground>
        </KeyboardAwareScrollView>
    )
}

Signup.navigationOptions = { 
    header: null,
    gesturesEnabled: true
}

const getStyles = theme => StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },
    mask: {
        flex: 1,
        backgroundColor: theme.mask,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    buttonMask: {
        backgroundColor: theme.buttonMask,
        elevation: 0
    },
    errorText: {
        color: 'red', 
        fontWeight: 'bold',
        textAlign: 'center'
    },
    bold: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,
    },
    inputBox: {
        width: '100%',
        borderRadius: 30,
        borderWidth: 1,
        backgroundColor: theme._e0ebf2, 
        borderColor: theme.borderColor,
        marginTop: 15,
        marginBottom: 15,
    },
    inputText: {
        color: theme.pbmText,
    },
    textLink: {
        fontSize: 14,
        textAlign: "center",
        fontWeight: "bold",
        color: theme.buttonTextColor,
    },
    iconStyle: {
        fontSize: 24,
        color: theme.placeholder,
        marginRight: 5
    },
    buttonStyle: {
        backgroundColor: theme.buttonColor,
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    buttonTitle: {
        color: theme.buttonTextColor, 
        fontSize: 16,
        fontWeight: '500'
    },
    justify: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: deviceHeight
    },
    disabledStyle: {
        backgroundColor: theme._e0f1fb,
        borderRadius: 50
    },
    disabledTitleStyle: {
        color: theme.disabledText
    },
})

Signup.propTypes = {
    login: PropTypes.func,
    loginLater: PropTypes.func,
    navigation: PropTypes.object,
}

const mapStateToProps = () => ({ })
const mapDispatchToProps = (dispatch) => ({
    login: credentials => dispatch(login(credentials)),
    loginLater: () => dispatch(loginLater()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup)

