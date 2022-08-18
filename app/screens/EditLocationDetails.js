import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Keyboard,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native'
import { ThemeContext } from '../theme-context'
import {
    ActivityIndicator,
    DropDownButton,
    PbmButton,
    Screen,
    Text,
    WarningButton,
} from '../components'
import {
    clearError,
    clearSelectedState,
    setSelectedOperator,
    setSelectedLocationType,
    updateLocationDetails,
} from '../actions'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'

function EditLocationDetails({
    navigation,
    route,
    setSelectedLocationType,
    setSelectedOperator,
    ...props
}) {
    confirmEditLocationDetails = () => {
        props.updateLocationDetails(navigation.goBack, phone, website, description)
    }

    acceptError = () => {
        props.clearError()
        setShowEditLocationDetailsModal(false)
    }

    const [phone, setPhone] = useState(props.location.location.phone)
    const [website, setWebsite] = useState(props.location.location.website)
    const [description, setDescription] = useState(props.location.location.description)

    const { operator, locationType, name } = props.location.location
    const { locationTypes } = props.locations
    const { operators } = props.operators
    const { updatingLocationDetails } = props.location.location
    const { errorText } = props.error

    const locationTypeId = locationType ? locationType : route.params?.setSelectedLocationType ? route.params?.setSelectedLocationType : props.location.location.location_type_id

    const operatorId = operator ? operator : route.params?.setSelectedOperator ? route.params?.setSelectedOperator : props.location.location.operator_id

    const locationTypeObj = locationTypes.find(type => type.id === locationTypeId) || {}
    const { name: locationTypeName = locationTypeId === -1 ? 'N/A' : 'Select location type' } = locationTypeObj

    const operatorObj = operators.find(op => op.id === operatorId) || {}
    const { name: operatorName = operator === -1 ? 'N/A' : 'Select operator' } = operatorObj
    const keyboardDismissProp = Platform.OS === "ios" ? { keyboardDismissMode: "on-drag" } : { onScrollBeginDrag: Keyboard.dismiss }

    const [showEditLocationDetailsModal, setShowEditLocationDetailsModal] = useState(false)

    React.useEffect(() => {
        navigation.setOptions({ title: name })
    }, [])

    React.useEffect(() => {
        if (route.params?.setSelectedLocationType) {
            setSelectedLocationType(route.params?.setSelectedLocationType)
        }
    }, [route.params?.setSelectedLocationType, setSelectedLocationType])

    React.useEffect(() => {
        if (route.params?.setSelectedOperator) {
            setSelectedOperator(route.params?.setSelectedOperator)
        }
    }, [route.params?.setSelectedOperator, setSelectedOperator])

    const goToFindLocationType = () => {
        navigation.navigate('FindLocationType', {
            previous_screen: 'EditLocationDetails',
            type: 'search',
            setSelectedLocationType: (id) => setSelectedLocationType(id)
        })
    }

    const goToFindOperator = () => {
        navigation.navigate('FindOperator', {
            previous_screen: 'EditLocationDetails',
            type: 'search',
            setSelectedOperator: (id) => setSelectedOperator(id)
        })
    }

    return (
        <ThemeContext.Consumer>
            {({ theme }) => {
                const s = getStyles(theme)
                return (
                    <Screen keyboardShouldPersistTaps="handled" {...keyboardDismissProp}>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={showEditLocationDetailsModal}
                            onRequestClose={() => { }}
                        >
                            {errorText ?
                                <View style={{ marginTop: 100, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, color: theme.red2 }}>{errorText}</Text>
                                    <PbmButton
                                        title={"OK"}
                                        onPress={() => acceptError()}
                                    />
                                </View>
                                :
                                <SafeAreaProvider>
                                    <SafeAreaView style={s.background}>
                                        <ScrollView style={{ backgroundColor: theme.base1 }}>
                                            <Text style={s.title}>Phone</Text>
                                            <Text style={s.preview}>{phone}</Text>
                                            <View style={s.hr}></View>
                                            <Text style={s.title}>Website</Text>
                                            <Text style={s.preview}>{website}</Text>
                                            <View style={s.hr}></View>
                                            <Text style={s.title}>Location Notes</Text>
                                            <Text style={s.preview}>{description}</Text>
                                            <View style={s.hr}></View>
                                            <Text style={s.title}>Location Type</Text>
                                            <Text style={s.preview}>{typeof locationTypeId === 'number' && locationTypeId > -1 ? locationTypes.filter(type => type.id === locationTypeId).map(type => type.name) : 'None Selected'}</Text>
                                            <View style={s.hr}></View>
                                            <Text style={s.title}>Operator</Text>
                                            <Text style={s.preview}>{typeof operatorId === 'number' && operatorId > -1 ? operators.filter(op => op.id === operatorId).map(operator => operator.name) : 'None Selected'}</Text>
                                            <PbmButton
                                                title={'Confirm Details'}
                                                onPress={() => confirmEditLocationDetails()}
                                            />
                                            <WarningButton
                                                title={'Cancel'}
                                                onPress={() => setShowEditLocationDetailsModal(false)}
                                            />
                                        </ScrollView>
                                    </SafeAreaView>
                                </SafeAreaProvider>
                            }
                        </Modal>
                        {updatingLocationDetails ?
                            <ActivityIndicator /> :
                            <Pressable onPress={() => { Keyboard.dismiss() }}>
                                <View style={{ marginLeft: 10, marginRight: 10 }}>
                                    <Text style={s.title}>Phone</Text>
                                    <TextInput
                                        style={[{ height: 40 }, s.textInput, s.radius10]}
                                        underlineColorAndroid='transparent'
                                        onChangeText={phone => setPhone(phone)}
                                        value={phone}
                                        returnKeyType="done"
                                        placeholder={phone || '(503) xxx-xxxx'}
                                        placeholderTextColor={theme.indigo4}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    <Text style={s.title}>Website</Text>
                                    <TextInput
                                        style={[{ height: 40 }, s.textInput, s.radius10]}
                                        underlineColorAndroid='transparent'
                                        onChangeText={website => setWebsite(website)}
                                        value={website}
                                        returnKeyType="done"
                                        placeholder={website || 'https://...'}
                                        placeholderTextColor={theme.indigo4}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    <Text style={s.title}>Location Notes</Text>
                                    <TextInput
                                        multiline={true}
                                        numberOfLines={4}
                                        style={[{ height: 100 }, s.textInput, s.radius10]}
                                        onChangeText={description => setDescription(description)}
                                        underlineColorAndroid='transparent'
                                        value={description}
                                        placeholder={description || 'Location description...'}
                                        placeholderTextColor={theme.indigo4}
                                        textAlignVertical='top'
                                    />
                                    <Text style={s.title}>Location Type</Text>
                                    <DropDownButton
                                        title={locationTypeName}
                                        containerStyle={[s.containerStyle]}
                                        onPress={() => goToFindLocationType()}
                                    />
                                    <Text style={s.title}>Operator</Text>
                                    <DropDownButton
                                        title={operatorName}
                                        containerStyle={[{ marginBottom: 10 }, s.containerStyle]}
                                        onPress={() => goToFindOperator()}
                                    />
                                    <PbmButton
                                        title={'Submit Location Details'}
                                        onPress={() => setShowEditLocationDetailsModal(true)}
                                    />
                                </View>
                            </Pressable>
                        }
                    </Screen>
                )
            }}
        </ThemeContext.Consumer>
    )

}

const getStyles = theme => StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: theme.base1
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    title: {
        textAlign: 'center',
        marginBottom: 5,
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'boldFont',
        color: theme.text2
    },
    preview: {
        fontSize: 14,
        marginRight: 25,
        marginLeft: 25
    },
    textInput: {
        backgroundColor: theme.white,
        borderColor: theme.indigo4,
        color: theme.text,
        borderWidth: 1,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    radius10: {
        borderRadius: 10
    },
    hr: {
        marginLeft: 25,
        marginRight: 25,
        height: 2,
        marginTop: 10,
        backgroundColor: theme.indigo4
    },
    containerStyle: {
        marginTop: 0,
        marginHorizontal: 20,
    },

})

EditLocationDetails.propTypes = {
    locations: PropTypes.object,
    location: PropTypes.object,
    operators: PropTypes.object,
    error: PropTypes.object,
    updateLocationDetails: PropTypes.func,
    clearError: PropTypes.func,
    navigation: PropTypes.object,
    setSelectedOperator: PropTypes.func,
    setSelectedLocationType: PropTypes.func,
    clearSelectedState: PropTypes.func,
}

const mapStateToProps = ({ error, locations, location, operators }) => ({ error, locations, location, operators })
const mapDispatchToProps = dispatch => ({
    updateLocationDetails: (goBack, phone, website, description) => dispatch(updateLocationDetails(goBack, phone, website, description)),
    clearError: () => dispatch(clearError()),
    setSelectedOperator: id => dispatch(setSelectedOperator(id)),
    setSelectedLocationType: id => dispatch(setSelectedLocationType(id)),
    clearSelectedState: () => dispatch(clearSelectedState()),
})
export default connect(mapStateToProps, mapDispatchToProps)(EditLocationDetails)
