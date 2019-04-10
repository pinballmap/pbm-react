import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
    StyleSheet,
    View, 
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
                    <Text>Password reset was successful. Check your email.</Text>
                    <PbmButton
                        title={"Great!"}
                        onPress={() => {
                            this.setState({ modalVisible: false})
                            this.props.navigation.navigate('Login')
                        }}
                    />
                </ConfirmationModal>
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
            </View>)
    }
}

const s = StyleSheet.create({
    inputBox: {
        width: '100%',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#000e18',
        backgroundColor: "#ffffff",
        marginTop: 15,
        marginBottom: 15,
    },
    inputText: {
        color: '#000e18',
    },
})

PasswordReset.propTypes = {
    navigation: PropTypes.object,
}

export default PasswordReset