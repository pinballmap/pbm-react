import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import {
    Keyboard,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import { Input } from 'react-native-elements'
import { ThemeContext } from '../theme-context'
import {
    ConfirmationModal,
    HeaderBackButton,
    PbmButton,
    Screen,
    Text,
} from '../components'
import { postData } from '../config/request'

const PasswordReset = ({ navigation }) => {
    const { theme } = useContext(ThemeContext)
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
                <ConfirmationModal visible={modalVisible}>
                    <Text style={s.confirmText}>Password reset was successful. Check your email.</Text>
                    <View>
                        <PbmButton
                            title={"Great!"}
                            onPress={() => {
                                setModalVisible(false)
                                navigation.navigate('Login')
                            }}
                            containerStyle={s.buttonContainer}
                        />
                    </View>
                </ConfirmationModal>
                <View style={{marginTop:10}}>
                    <Text style={s.titleText}>{`Reset Your Password`}</Text>
                    <Input
                        placeholder='Username or email...'
                        placeholderTextColor={theme.indigo4}
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
            </Screen>
        </TouchableWithoutFeedback>)
}

PasswordReset.navigationOptions = ({ navigation, theme }) => ({
    headerLeft: <HeaderBackButton navigation={navigation} />,
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#1d1c1d' : '#fff7eb',
    },
    headerTintColor: theme === 'dark' ? '#fdd4d7' : '#766a62',
    headerTitleStyle: {
        textAlign: 'center',
        flex: 1
    },
    gesturesEnabled: true
})

const getStyles = theme => StyleSheet.create({
    container: {
        marginLeft: 25,
        marginRight: 25
    },
    inputBox: {
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: theme.white,
        borderColor: theme.orange3,
        margin: 15,
        paddingLeft: 10
    },
    inputText: {
        color: theme.text,
    },
    confirmText: {
        textAlign: 'center',
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 18
    },
    titleText: {
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        marginBottom: 10
    },
})

PasswordReset.propTypes = {
    navigation: PropTypes.object,
}

export default PasswordReset
