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
import { 
    ConfirmationModal,
    HeaderBackButton,
    PbmButton,
    Screen,
    Text,
} from '../components'
import { postData } from '../config/request'

const ResendConfirmation = ({ navigation }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    const [identification, setIdentification] = useState('')
    const [identificationError, setIdentificationError] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
     
    const submit = () => {
        setIdentificationError('')
        postData('/users/resend_confirmation.json', { identification })
            .then(() => setModalVisible(true), 
                (err) => { throw err})
            .catch(identificationError => setIdentificationError(identificationError))
    }

    return(
        <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>
            <Screen>
                <ConfirmationModal visible={modalVisible}>
                    <Text style={s.confirmText}>Confirmation info resent.</Text>
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
                <View style={{marginTop:10}}>
                    <Text style={s.titleText}>{`Resend the Confirmation Email`}</Text>                 
                    <Input 
                        placeholder='Username or email...'
                        placeholderTextColor={theme.placeholder}
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

ResendConfirmation.navigationOptions = ({ navigation, theme }) => ({
    headerLeft: <HeaderBackButton navigation={navigation} />,
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#2a211c' : '#f5fbff',
    headerTintColor: theme === 'dark' ? '#9a836a' : '#4b5862',
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
        backgroundColor: theme._e0ebf2, 
        borderColor: theme.borderColor,
        margin: 15,
        paddingLeft: 10
    },
    inputText: {
        color: theme.pbmText,
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
