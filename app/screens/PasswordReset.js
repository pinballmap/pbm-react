import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { 
    Keyboard,
    StyleSheet,
    TouchableWithoutFeedback,
    View 
} from 'react-native'
import {
    Input,
    ThemeContext,
} from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { 
    ConfirmationModal,
    HeaderBackButton,
    PbmButton,
    Screen,
    Text,
} from '../components'
import { postData } from '../config/request'

const PasswordReset = ({ navigation }) => {
    const theme = useContext(ThemeContext)
    const s = getStyles(theme)

    const [identification, setIdentification] = useState('')
    const [identificationError, setIdentificationError] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
  
    const submit = () => {
        setIdentificationError('')
        postData('/users/forgot_password.json', { identification })
            .then(() => setModalVisible(true), 
                (err) => { throw err})
            .catch(identificationError => setIdentificationError(identificationError))
    }

    return(
        <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }> 
            <Screen>
                <KeyboardAwareScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center',alignItems:'center'}} keyboardDismissMode="on-drag" enableResetScrollToCoords={false} keyboardShouldPersistTaps="handled">
                    <ConfirmationModal visible={modalVisible}>
                        <Text style={s.confirmText}>Password reset was successful. Check your email.</Text>
                        <View>
                            <PbmButton
                                title={"Great!"}
                                onPress={() => {
                                    setModalVisible(false)
                                    navigation.navigate('Login')
                                }}
                            />
                        </View>
                    </ConfirmationModal>
                    <View>
                        <Text style={s.titleText}>{`Reset Your Password`}</Text>                        
                        <Input 
                            placeholder='Username or email...'
                            onChangeText={identification => setIdentification(identification)}
                            value={identification}
                            errorStyle={{ color: 'red' }}
                            errorMessage={identificationError}
                            inputContainerStyle={s.inputBox}
                            inputStyle={s.inputText}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <PbmButton 
                            title={'Submit'}
                            onPress={submit}
                            disabled={identification.length === 0}
                            containerStyle={s.container}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </Screen>
        </TouchableWithoutFeedback>)
}

PasswordReset.navigationOptions = ({ navigation, theme }) => ({
    headerLeft: <HeaderBackButton navigation={navigation} />,
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#2a211c' : '#f5fbff',
    },
})

const getStyles = theme => StyleSheet.create({
    container: {
        marginLeft: 25,
        marginRight: 25
    },
    inputBox: {
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#97a5af',
        backgroundColor: "#ffffff",
        width: '100%',
        margin: 15,
        paddingLeft: 10
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

PasswordReset.propTypes = {
    navigation: PropTypes.object,
}

export default PasswordReset
