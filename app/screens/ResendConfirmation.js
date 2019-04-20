import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View 
} from 'react-native'
import { Constants } from 'expo'
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

class ResendConfirmation extends Component {
    state = {
        identification: '',
        identificationError: '',
        modalVisible: false,
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton navigation={navigation} />,
            headerStyle: {
                backgroundColor:'#f5fbff',
                height: Expo.Constants.statusBarHeight > 40 ? 60 : Platform.OS === 'android' ? 56 : Platform.OS === 'ios' ? 44 : null, 
                paddingTop: Expo.Constants.statusBarHeight > 40 ? 30 : '',                
            },
        }
    }
     
    submit = () => {
        this.setState({ identificationError: '' })
        postData('/users/resend_confirmation.json', { identification: this.state.identification })
            .then(() => this.setState({ modalVisible: true }), 
                (err) => { throw err})
            .catch(identificationError => this.setState({ identificationError }))
    }

    render(){
        return(
            <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>
                <View style={{flex: 1,backgroundColor:'#f5fbff'}}>
                    <ScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center',alignItems:'center'}} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
                        <ConfirmationModal visible={this.state.modalVisible}>
                            <Text style={s.confirmText}>Confirmation info resent.</Text>
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
                        <View>
                            <Text style={s.titleText}>{`Resend the Confirmation Email`}</Text>                 
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
            </View>
        </TouchableWithoutFeedback>)
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
    confirmText: {
        textAlign: 'center',
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 18
    },
    titleText: {
        textAlign:'center',
        marginBottom:10,
        fontSize: 18,
        fontWeight: 'bold'
    }
})

ResendConfirmation.propTypes = {
    navigation: PropTypes.object,
}

export default ResendConfirmation