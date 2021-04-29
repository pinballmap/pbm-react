import React, { Component } from 'react'
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
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import {
    getFavoriteLocations,
    login,
    loginLater
} from '../actions/user_actions'
import { getData } from '../config/request'

let deviceHeight = Dimensions.get('window').height

class Login extends Component {
    constructor(props) {
        super(props)
        this.state={
            errors: false,
            login: null,
            loginError: null,
            password: null,
            passwordError: null,
            apiErrorMsg: null,
        }

    }

    static navigationOptions = () => {
        return {
            header: () => null,
            headerLeft: () => null,
            gestureEnabled: true
        }
    }

    submit = () => {
        this.setState({
            errors: false,
            loginError: null,
            passwordError: null,
        })
        getData(`/users/auth_details.json?login=${encodeURIComponent(this.state.login)}&password=${encodeURIComponent(this.state.password)}`)
            .then(data => {
                if (data.errors) {
                    this.setState({ errors: true })

                    if(data.errors === 'Unknown user')
                        this.setState({ loginError: 'Unknown user' })

                    if(data.errors === 'Incorrect password')
                        this.setState({ passwordError: 'Incorrect password' })

                    if(data.errors === 'User is not yet confirmed. Please follow emailed confirmation instructions.')
                        this.setState({ apiErrorMsg: 'User is not yet confirmed. Please follow emailed confirmation instructions.'})
                }
                if (data.user) {
                    this.props.login(data.user)
                    this.props.getFavoriteLocations(data.user.id)
                    this.props.navigation.navigate('Map')
                }
            })
            .catch(err => this.setState({ errors: true, apiErrorMsg: err }))
    }

    render() {
        return (
            <ThemeContext.Consumer>
                {({ theme }) => {
                    const s = getStyles(theme)
                    return (
                        <KeyboardAwareScrollView keyboardDismissMode="on-drag" enableResetScrollToCoords={false} keyboardShouldPersistTaps="handled">
                            <ImageBackground source={require('../assets/images/pbm-fade-tall.png')} style={s.backgroundImage}>
                                <View style={s.mask}>
                                    <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>
                                        <View style={s.justify}>
                                            {this.state.errors &&
                                                    <Text style={s.errorText}>
                                                        {this.state.apiErrorMsg ? this.state.apiErrorMsg : 'There were errors trying to process your submission'}
                                                    </Text>
                                            }
                                            <Text style={s.bold}>Log In</Text>
                                            <Input
                                                placeholder='Username or Email'
                                                leftIcon={<MaterialIcons name='face' style={s.iconStyle} />}
                                                onChangeText={login => this.setState({login})}
                                                value={this.state.login}
                                                errorStyle={{ color: 'red' }}
                                                errorMessage={this.state.loginError}
                                                inputContainerStyle={s.inputBox}
                                                inputStyle={s.inputText}
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                            />
                                            <Input
                                                placeholder='Password'
                                                leftIcon={<MaterialIcons name='lock-outline' style={s.iconStyle} />}
                                                onChangeText={password => this.setState({password})}
                                                value={this.state.password}
                                                errorStyle={{ color: 'red' }}
                                                errorMessage={this.state.passwordError}
                                                inputContainerStyle={s.inputBox}
                                                inputStyle={s.inputText}
                                                secureTextEntry={true}
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                            />
                                            <Button
                                                onPress={() => this.submit()}
                                                raised
                                                buttonStyle={s.buttonStyle}
                                                titleStyle={s.buttonTitle}
                                                containerStyle={{marginLeft:10,marginRight:10,marginTop:15,marginBottom:25,overflow:'hidden',borderRadius: 25}}
                                                title="Log In"
                                                accessibilityLabel="Log In"
                                                disabled={!this.state.login || !this.state.password}
                                                disabledStyle={s.disabledStyle}
                                                disabledTitleStyle={s.disabledTitleStyle}
                                            />
                                            <Button
                                                onPress={() => this.props.navigation.navigate('Signup')}
                                                titleStyle={s.textLink}
                                                containerStyle={{marginBottom: 20}}
                                                buttonStyle={s.buttonMask}
                                                title="Not a user? SIGN UP!"
                                            />
                                            <Button
                                                onPress={() => this.props.navigation.navigate('PasswordReset')}
                                                title="I forgot my password"
                                                titleStyle={s.textLink}
                                                containerStyle={{marginBottom: 20}}
                                                buttonStyle={s.buttonMask}
                                            />
                                            <Button
                                                onPress={() => this.props.navigation.navigate('ResendConfirmation')}
                                                title="Resend my confirmation email"
                                                titleStyle={s.textLink}
                                                containerStyle={{marginBottom: 20}}
                                                buttonStyle={s.buttonMask}
                                            />
                                            <Button
                                                onPress={() => {
                                                    this.props.loginLater()
                                                    this.props.navigation.navigate('Map')
                                                }}
                                                titleStyle={s.textLink}
                                                buttonStyle={s.buttonMask}
                                                title="Skip logging in for now"
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </ImageBackground>
                        </KeyboardAwareScrollView>
                    )
                }}
            </ThemeContext.Consumer>
        )
    }
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
        fontSize: 22,
        color: theme.text,
        textShadowColor: theme.white,
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 2,
    },
    inputBox: {
        width: '100%',
        borderRadius: 25,
        borderWidth: 1,
        backgroundColor: theme.white,
        borderColor: theme.orange3,
        marginTop: 15,
        marginBottom: 15,
        paddingLeft: 10
    },
    inputText: {
        color: theme.text,
    },
    textLink: {
        fontSize: 16,
        textAlign: "center",
        fontWeight: "bold",
        color: theme.orange7,
        textShadowColor: theme.white,
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 2,
    },
    iconStyle: {
        fontSize: 24,
        color: theme.indigo4,
        marginRight: 5,
        marginLeft: 5
    },
    buttonStyle: {
        backgroundColor: theme.blue2,
        width: '100%',
        elevation: 0,
        borderRadius: 25
    },
    buttonTitle: {
        color: theme.orange8,
        fontSize: 16,
        fontWeight: '500'
    },
    justify: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: deviceHeight,
        marginLeft: 15,
        marginRight: 15
    },
    disabledStyle: {
        backgroundColor: theme.white,
    },
    disabledTitleStyle: {
        color: theme.orange3
    },
})

Login.propTypes = {
    login: PropTypes.func,
    loginLater: PropTypes.func,
    navigation: PropTypes.object,
    getFavoriteLocations: PropTypes.func,
}

const mapStateToProps = () => ({ })
const mapDispatchToProps = (dispatch) => ({
    login: credentials => dispatch(login(credentials)),
    loginLater: () => dispatch(loginLater()),
    getFavoriteLocations: (id) => dispatch(getFavoriteLocations(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
