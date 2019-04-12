import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
    Dimensions, 
    ImageBackground,
    Keyboard,
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableWithoutFeedback, 
    View, 
} from 'react-native'
import { Button, Input } from 'react-native-elements'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { login, loginLater } from '../actions/user_actions'
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
            headerLeft: null,
        } 
    }
    
    submit = () => {
        this.setState({
            errors: false,
            loginError: null,
            passwordError: null,
        })
        getData(`/users/auth_details.json?login=${this.state.login}&password=${this.state.password}`)
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
                    this.props.navigation.navigate('Map')
                }
            })
            .catch(err => this.setState({ errors: true, apiErrorMsg: err }))
    }

    render() {
        return (
            <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
                <ImageBackground source={require('../assets/images/pbm-fade.png')} style={s.backgroundImage}>     
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
                                    spellCheck={false}
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
                                    spellCheck={false}
                                />
                                <Button
                                    onPress={() => this.submit()}
                                    raised
                                    buttonStyle={s.buttonStyle}
                                    titleStyle={{
                                        color:"#4b5862", 
                                        fontSize:18
                                    }}
                                    containerStyle={{marginTop:15,marginBottom:25,borderRadius:50}}
                                    style={{borderRadius: 50}}
                                    title="Log In"
                                    accessibilityLabel="Log In"
                                    disabled={!this.state.login || !this.state.password}
                                    disabledStyle={{borderRadius:50}}
                                />
                                <Button
                                    onPress={() => this.props.navigation.navigate('Signup')}
                                    titleStyle={s.textLink}
                                    containerStyle={{marginBottom: 20}}
                                    buttonStyle={{backgroundColor:'rgba(255,255,255,.2)',elevation: 0}}
                                    title="Not a user? SIGN UP!"
                                />              
                                <Button
                                    onPress={() => this.props.navigation.navigate('PasswordReset')}
                                    title="I forgot my password"
                                    titleStyle={s.textLink}
                                    containerStyle={{marginBottom: 20}}
                                    buttonStyle={{backgroundColor:'rgba(255,255,255,.2)',elevation: 0}}
                                />
                                <Button
                                    onPress={() => this.props.navigation.navigate('ResendConfirmation')}
                                    title="Resend my confirmation email"
                                    titleStyle={s.textLink}
                                    containerStyle={{marginBottom: 20}}
                                    buttonStyle={{backgroundColor:'rgba(255,255,255,.2)',elevation: 0}}
                                />                       
                                <Button 
                                    onPress={() => {
                                        this.props.loginLater()
                                        this.props.navigation.navigate('Map')
                                    }} 
                                    titleStyle={s.textLink}
                                    buttonStyle={{backgroundColor:'rgba(255,255,255,.2)',elevation: 0}}
                                    title="skip logging in for now"
                                />
                            </View>
                        </TouchableWithoutFeedback>          
                    </View>
                </ImageBackground>
            </ScrollView>
        )
    }
}

const s = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },
    mask: {
        flex: 1,
        backgroundColor:'rgba(255,255,255,.7)',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    errorText: {
        color: 'red', 
        fontWeight: 'bold',
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
        borderColor: '#97a5af',
        backgroundColor: "#f5fbff",
        marginTop: 15,
        marginBottom: 15,
    },
    inputText: {
        color: '#000e18',
    },
    textLink: {
        fontSize: 14,
        textAlign: "center",
        fontWeight: "bold",
        color: '#4b5862',
    },
    iconStyle: {
        fontSize: 24,
        color: '#97a5af',
    },
    buttonStyle: {
        backgroundColor:"#D3ECFF",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    justify: {
        flexDirection: 'column',
        justifyContent: 'center',
        height:deviceHeight
    }
})

Login.propTypes = {
    login: PropTypes.func,
    loginLater: PropTypes.func,
    navigation: PropTypes.object,
}

const mapStateToProps = () => ({ })
const mapDispatchToProps = (dispatch) => ({
    login: credentials => dispatch(login(credentials)),
    loginLater: () => dispatch(loginLater()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
