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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { postData } from '../config/request'

const ResendConfirmation = ({ navigation }) => {
    const theme = useContext(ThemeContext)
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
                <KeyboardAwareScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center',alignItems:'center'}} keyboardDismissMode="on-drag" enableResetScrollToCoords={false} keyboardShouldPersistTaps="handled">
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
                    <View>
                        <Text style={s.titleText}>{`Resend the Confirmation Email`}</Text>                 
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
                        />
                    </View>
                </KeyboardAwareScrollView>    
            </Screen>
        </TouchableWithoutFeedback>)
}

ResendConfirmation.navigationOptions = ({ navigation }) => ({
    headerLeft: <HeaderBackButton navigation={navigation} />,
})

const getStyles = theme => StyleSheet.create({
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