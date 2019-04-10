import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
    Dimensions,
    Keyboard,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View 
} from 'react-native'
import {
    Input,
} from 'react-native-elements'
import { 
    ConfirmationModal,
    HeaderBackButton,
    PbmButton,
    Text,
} from '../components'
import { postData } from '../config/request'

let deviceHeight = Dimensions.get('window').height

class PasswordReset extends Component {
    state = {
        identification: '',
        identificationError: '',
        modalVisible: false,
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton navigation={navigation} />,
        }
    }
     
    submit = () => {
        this.setState({ identificationError: '' })
        postData('/users/forgot_password.json', { identification: this.state.identification })
            .then(() => this.setState({ modalVisible: true }), 
                (err) => { throw err})
            .catch(identificationError => this.setState({ identificationError }))
    }

    render(){
        return(
            <View style={{flex: 1,backgroundColor:'#f5fbff'}}>
                <ConfirmationModal visible={this.state.modalVisible}>
                    <Text style={s.confirmText}>Password reset was successful. Check your email.</Text>
                    <View>
                        <PbmButton
                            title={"Great!"}
                            onPress={() => {
                                this.setState({ modalVisible: false})
                                this.props.navigation.navigate('Login')
                            }}
                        />
                    </View>
                </ConfirmationModal>
                <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>
                    <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled" style={{backgroundColor:'#f5fbff'}}>
                        <View style={s.verticalAlign}>
                            <Text style={{textAlign:'center',marginBottom:10,marginLeft:15,marginRight:15,fontSize: 18}}>{`Reset Your Password`}</Text>                        
                            <Input 
                                placeholder='Username or email...'
                                onChangeText={identification => this.setState({identification})}
                                value={this.state.identification}
                                errorStyle={{ color: 'red' }}
                                errorMessage={this.state.identificationError}
                                inputContainerStyle={s.inputBox}
                                inputStyle={s.inputText}
                            />
                            <PbmButton 
                                title={'Submit'}
                                onPress={() => this.submit()}
                                disabled={this.state.identification.length === 0}
                            />
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </View>)
    }
}

const s = StyleSheet.create({
    inputBox: {
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#97a5af',
        backgroundColor: "#ffffff",
        margin: 15,
        width: '100%'
    },
    inputText: {
        color: '#000e18',
    },
    verticalAlign: {
        flexDirection: 'column',
        justifyContent: 'center',
        height:deviceHeight - 80
    },
    confirmText: {
        textAlign: 'center',
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 18
    }
})

PasswordReset.propTypes = {
    navigation: PropTypes.object,
}

export default PasswordReset