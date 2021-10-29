import React, { Component } from 'react'
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
    HeaderBackButton,
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
import { SafeAreaView } from 'react-native-safe-area-context'

class EditLocationDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            phone: props.location.location.phone,
            website: props.location.location.website,
            description: props.location.location.description,
            selectedLocationType: props.location.location.location_type_id,
            showEditLocationDetailsModal: false,
        }
    }

    static navigationOptions = ({ navigation, theme }) => {
        return {
            headerLeft: () => <HeaderBackButton navigation={navigation} />,
            title: navigation.getParam('name'),
            headerRight: () =><View style={{padding:6}}></View>,
            headerStyle: {
                backgroundColor: theme === 'dark' ? '#1d1c1d' : '#f5f5ff',
                borderBottomWidth: 0,
                elevation: 0,
                shadowColor: 'transparent'
            },
            headerTitleStyle: {
                textAlign: 'center',
                fontFamily: 'boldFont',
            },
            headerTintColor: theme === 'dark' ? '#fdd4d7' : '#616182',
            gestureEnabled: true
        }
    }

    confirmEditLocationDetails = () => {
        const { phone, website, description } = this.state
        this.props.updateLocationDetails(this.props.navigation.goBack, phone, website, description)
    }

    acceptError = () => {
        this.props.clearError()
        this.setState({ showEditLocationDetailsModal: false })
    }

    componentWillUnmount() {
        this.props.clearSelectedState()
    }

    render(){
        const { phone, website, description } = this.state
        const { operator, locationType, location } = this.props.location
        const { locationTypes } = this.props.locations
        const { operators } = this.props.operators
        const { updatingLocationDetails } = this.props.location.location
        const { navigate } = this.props.navigation
        const { errorText } = this.props.error
        const locationTypeId = locationType ? locationType : location.location_type_id
        const operatorId = operator ? operator : location.operator_id

        const locationTypeObj = locationTypes.find(type => type.id === locationTypeId) || {}
        const { name: locationTypeName = locationTypeId === -1 ? 'N/A' : 'Select location type' } = locationTypeObj

        const operatorObj = operators.find(op=> op.id === operatorId) || {}
        const { name: operatorName = operator === -1 ? 'N/A' : 'Select operator' } = operatorObj
        const keyboardDismissProp = Platform.OS === "ios" ? { keyboardDismissMode: "on-drag" } : { onScrollBeginDrag: Keyboard.dismiss }

        return(
            <ThemeContext.Consumer>
                {({ theme }) => {
                    const s = getStyles(theme)
                    return (
                        <Screen keyboardShouldPersistTaps="handled" {...keyboardDismissProp}>
                            <Modal
                                animationType="slide"
                                transparent={false}
                                visible={this.state.showEditLocationDetailsModal}
                                onRequestClose={()=>{}}
                            >
                                {errorText ?
                                    <View style={{marginTop: 100,alignItems: 'center'}}>
                                        <Text style={{fontSize:16,color:theme.red2}}>{errorText}</Text>
                                        <PbmButton
                                            title={"OK"}
                                            onPress={() => this.acceptError()}
                                        />
                                    </View>
                                    :
                                    <SafeAreaView style={s.background}>
                                        <ScrollView style={{backgroundColor:theme.base1}}>
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
                                            <Text style={s.preview}>{typeof operatorId  === 'number' && operator > -1 ? operators.filter(op => op.id === operatorId).map(operator => operator.name) : 'None Selected'}</Text>
                                            <PbmButton
                                                title={'Confirm Details'}
                                                onPress={() => this.confirmEditLocationDetails()}
                                            />
                                            <WarningButton
                                                title={'Cancel'}
                                                onPress={() => this.setState({ showEditLocationDetailsModal: false})}
                                            />
                                        </ScrollView>
                                    </SafeAreaView>
                                }
                            </Modal>
                            {updatingLocationDetails ?
                                <ActivityIndicator /> :
                                <Pressable onPress={ () => { Keyboard.dismiss() } }>
                                    <View style={{marginLeft:10,marginRight:10}}>
                                        <Text style={s.title}>Phone</Text>
                                        <TextInput
                                            style={[{height: 40},s.textInput,s.radius10]}
                                            underlineColorAndroid='transparent'
                                            onChangeText={phone => this.setState({ phone })}
                                            value={phone}
                                            returnKeyType="done"
                                            placeholder={phone || '(503) xxx-xxxx'}
                                            placeholderTextColor={theme.indigo4}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                        />
                                        <Text style={s.title}>Website</Text>
                                        <TextInput
                                            style={[{height: 40},s.textInput,s.radius10]}
                                            underlineColorAndroid='transparent'
                                            onChangeText={website => this.setState({ website })}
                                            value={website}
                                            returnKeyType="done"
                                            placeholder={website || 'http://...'}
                                            placeholderTextColor={theme.indigo4}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                        />
                                        <Text style={s.title}>Location Notes</Text>
                                        <TextInput
                                            multiline={true}
                                            numberOfLines={4}
                                            style={[{height: 100},s.textInput,s.radius10]}
                                            onChangeText={description => this.setState({ description })}
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
                                            onPress={() => navigate('FindLocationType', {type: 'search', setSelected: (id) => this.props.setSelectedLocationType(id)})}
                                        />
                                        <Text style={s.title}>Operator</Text>
                                        <DropDownButton
                                            title={operatorName}
                                            containerStyle={[{marginBottom:10},s.containerStyle]}
                                            onPress={() => navigate('FindOperator', {type: 'search', setSelected: (id) => this.props.setSelectedOperator(id)})}
                                        />
                                        <PbmButton
                                            title={'Submit Location Details'}
                                            onPress={() => this.setState({ showEditLocationDetailsModal: true })}
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
}

const getStyles = theme => StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: theme.base1
    },
    title: {
        textAlign:'center',
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
