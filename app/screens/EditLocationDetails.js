import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { 
    ActivityIndicator, 
    Keyboard,
    Modal, 
    Picker, 
    Platform, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    TextInput, 
    TouchableWithoutFeedback, 
    View, 
} from 'react-native'
import { 
    ConfirmationModal, 
    DropDownButton, 
    HeaderBackButton,
    PbmButton, 
    WarningButton, 
    Text 
} from '../components'
import { 
    clearError,
    clearSelectedState,
    setSelectedOperator,
    updateLocationDetails, 
} from '../actions'
import { 
    headerStyle,
    headerTitleStyle,
} from '../styles'

class EditLocationDetails extends Component {
    constructor(props) {
        super(props)
        const { locationTypes }  = this.props.locations
        locationTypes.unshift({name: 'None Selected', id: '' })

        this.state = {
            phone: props.location.location.phone,
            website: props.location.location.website, 
            description: props.location.location.description,
            selectedLocationType: props.location.location.location_type_id,
            locationTypes,
            showEditLocationDetailsModal: false,
            showSelectLocationTypeModal: false,
            originalLocationType: null,
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: <Text>{navigation.getParam('name')}</Text>,
            headerTitleStyle,
            headerStyle,
            headerTintColor: '#4b5862'
        }
    }

    confirmEditLocationDetails = () => {
        const { phone, website, description, selectedLocationType } = this.state
        this.props.updateLocationDetails(this.props.navigation.goBack, phone, website, description, selectedLocationType, this.props.location.operator)
    }

    selectingLocationType = () => {
        this.setState({ showSelectLocationTypeModal: true, originalLocationType: this.state.selectedLocationType })
    }

    acceptError = () => {
        this.props.clearError()
        this.setState({ showEditLocationDetailsModal: false })
    }

    componentWillUnmount() {
        this.props.clearSelectedState()
    }

    render(){
        const { phone, website, description, selectedLocationType, locationTypes } = this.state
        const { operator } = this.props.location
        const { operators } = this.props.operators
        const { updatingLocationDetails } = this.props.location.location
        const { navigate } = this.props.navigation
        const { errorText } = this.props.error

        const locationTypeObj = locationTypes.find(type => type.id === selectedLocationType) || {}
        const { name: locationTypeName = 'Select location type' } = locationTypeObj

        const operatorObj = operators.find(op=> op.id === operator) || {}
        const { name: operatorName = "Select operator" } = operatorObj

        return(
            <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" style={{ flex: 1,backgroundColor:'#f5fbff' }}>
                <ConfirmationModal 
                    visible={this.state.showSelectLocationTypeModal}
                >
                    <ScrollView>
                        <Picker 
                            selectedValue={selectedLocationType}
                            onValueChange={itemValue => this.setState({ selectedLocationType: itemValue })}>
                            {locationTypes.map(m => (
                                <Picker.Item label={m.name} value={m.id} key={m.id} />
                            ))}
                        </Picker>
                    </ScrollView>
                    <PbmButton
                        title={'OK'}
                        onPress={() => this.setState({ showSelectLocationTypeModal: false, originalLocationType: null })}
                    />
                    <WarningButton 
                        title={'Cancel'}
                        onPress={() => this.setState({ showSelectLocationTypeModal: false, selectedLocationType: this.state.originalLocationType, originalLocationType: null })}
                    />
                </ConfirmationModal>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showEditLocationDetailsModal}
                    onRequestClose={()=>{}}
                >
                    {errorText ? 
                        <View style={{marginTop: 100}}>
                            <Text>{errorText}</Text>
                            <PbmButton 
                                title={"OK"}
                                onPress={() => this.acceptError()}
                            />
                        </View>
                        :              
                        <SafeAreaView style={{flex: 1,backgroundColor:'#f5fbff'}}>         
                            <ScrollView style={{backgroundColor:'#f5fbff'}}>
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
                                <Text style={s.preview}>{typeof selectedLocationType === 'number' ? locationTypes.filter(type => type.id === selectedLocationType).map(type => type.name) : 'None Selected'}</Text>
                                <View style={s.hr}></View>
                                <Text style={s.title}>Operator</Text>
                                <Text style={s.preview}>{typeof operator === 'number' ? operators.filter(op => op.id === operator).map(operator => operator.name) : 'None Selected'}</Text>
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
                    <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>
                        <View style={{marginLeft:10,marginRight:10}}>
                            <Text style={s.title}>Phone</Text>
                            <TextInput 
                                style={[{height: 40},s.textInput,s.radius10]}
                                keyboardType='numeric'
                                underlineColorAndroid='transparent'
                                onChangeText={phone => this.setState({ phone })}
                                value={phone}
                                returnKeyType="done"
                                placeholder={phone || '(503) xxx-xxxx'}
                            />
                            <Text style={s.title}>Website</Text>
                            <TextInput
                                style={[{height: 40},s.textInput,s.radius10]}
                                underlineColorAndroid='transparent'
                                onChangeText={website => this.setState({ website })}
                                value={website}
                                returnKeyType="done"
                                placeholder={website || 'http://...'}
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
                                textAlignVertical='top'
                            />
                            <Text style={s.title}>Location Type</Text>
                            {Platform.OS === "ios" ? 
                                <DropDownButton
                                    title={locationTypeName}
                                    onPress={() => this.selectingLocationType()}
                                /> : 
                                <View style={s.viewPicker}>
                                    <Picker 
                                        style={s.pickerbg}
                                        selectedValue={selectedLocationType}
                                        onValueChange={itemValue => this.setState({ selectedLocationType: itemValue })}>
                                        {locationTypes.map(m => (
                                            <Picker.Item label={m.name} value={m.id} key={m.id} />
                                        ))}
                                    </Picker>
                                </View>
                            }
                            <Text style={s.title}>Operator</Text>
                            <DropDownButton
                                title={operatorName}
                                onPress={() => navigate('FindOperator', {type: 'search', setSelected: (id) => this.props.setSelectedOperator(id)})}
                            />                        
                            <PbmButton
                                title={'Submit Location Details'}
                                onPress={() => this.setState({ showEditLocationDetailsModal: true })}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                }
            </ScrollView>
        )
    }
}

const s = StyleSheet.create({ 
    title: {
        textAlign:'center',
        marginBottom: 5,
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
        color: "#6a7d8a"
    },
    preview: {
        fontSize: 14,
        marginRight: 25,
        marginLeft: 25
    },
    textInput: {
        backgroundColor: '#e0ebf2', 
        borderColor: '#d1dfe8',
        borderWidth: 1,
        marginLeft: 15,
        marginRight: 15,
        paddingLeft: 10,
        paddingRight: 5
    },
    radius10: {
        borderRadius: 10
    },
    pickerbg: {
        marginLeft: 10,
        marginRight: 10,
    },
    hr: {
        marginLeft:25,
        marginRight:25,
        height:2,
        marginTop: 10,
        backgroundColor:"#D3ECFF"
    },
    viewPicker: {
        backgroundColor:"#e0ebf2",
        borderColor: '#d1dfe8',
        borderWidth: 1,
        borderRadius: 10,
        marginLeft: 15,
        marginRight: 15
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
    clearSelectedState: PropTypes.func,
}

const mapStateToProps = ({ error, locations, location, operators }) => ({ error, locations, location, operators })
const mapDispatchToProps = dispatch => ({
    updateLocationDetails: (goBack, phone, website, description, selectedLocationType, selectedOperatorId) => dispatch(updateLocationDetails(goBack, phone, website, description, selectedLocationType, selectedOperatorId)),
    clearError: () => dispatch(clearError()),
    setSelectedOperator: id => dispatch(setSelectedOperator(id)),
    clearSelectedState: () => dispatch(clearSelectedState()),
})
export default connect(mapStateToProps, mapDispatchToProps)(EditLocationDetails)
