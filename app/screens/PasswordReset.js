import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import {
    Dimensions,
    Keyboard,
    Platform,
    StyleSheet,
    Pressable,
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

let deviceWidth = Dimensions.get('window').width

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
        <Screen>
            <Pressable onPress={ () => { Keyboard.dismiss() } }>
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
            </Pressable>
        </Screen>)
}

PasswordReset.navigationOptions = ({ navigation, theme }) => ({
    headerLeft: () => <HeaderBackButton navigation={navigation} />,
    title: 'Reset Your Password',
    headerRight: () => <View style={{padding:6}}></View>,
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#1d1c1d' : '#fffbf5',
        borderBottomWidth: 0,
        elevation: 0,
        shadowColor: 'transparent'
    },
    headerTintColor: theme === 'dark' ? '#fdd4d7' : '#766a62',
    headerTitleStyle: {
        textAlign: 'center',
        width: deviceWidth - 100,
        ...Platform.select({
            android: { flex: 1 }
        }),
    },
    gestureEnabled: true
})

const getStyles = theme => StyleSheet.create({
    container: {
        marginLeft: 25,
        marginRight: 25
    },
    inputBox: {
        borderRadius: 25,
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
