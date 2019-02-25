import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ActivityIndicator, Modal, Picker, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native'
import { ListItem } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { 
    ConfirmationModal, 
    DropDownButton, 
    NotLoggedIn, 
    PbmButton, 
    WarningButton, 
} from '../components'
import { 
    clearError,
    clearMachineList, 
    removeMachineFromList,
    suggestLocation,
} from '../actions'
import countries from '../utils/countries'

const DismissKeyboard = require('dismissKeyboard')

class SuggestLocation extends Component {
    constructor(props) {
        super(props)
        const { locationTypes }  = this.props.locations
        const { operators } = this.props.operators
        locationTypes.unshift({name: 'N/A', id: '' })
        operators.unshift({name: 'N/A', id: '' })

        this.state = {
            locationName: '',
            street: '',
            city: '',
            state: '',
            country: 'United States',
            phone: '',
            website: '', 
            description: '',
            locationType: null,
            operator: null, 
            showSelectLocationTypeModal: false,
            originalLocationType: '',
            showSelectOperatorModal: false, 
            originalOperator: '',
            showSelectCountryModal: false,
            locationTypes,
            operators,
            showSuggestLocationModal: false,
        }
    }
  
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'Suggest Location', 
            headerLeft: <HeaderBackButton tintColor="#000e18" onPress={() => navigation.goBack(null)} />,
            title: 'Suggest Location',
        }
    }

    selectingLocationType = () => {
        this.setState({ showSelectLocationTypeModal: true, originalLocationType: this.state.locationType })
    }

    selectingOperator = () => {
        this.setState({ showSelectOperatorModal: true, originalOperator: this.state.operator })
    }

    confirmSuggestLocationDetails = () => {
        const { 
            locationName,
            street, 
            city, 
            state,
            country,
            phone, 
            website, 
            description, 
            locationType, 
            operator, 
        } = this.state

        const locationDetails = {
            locationName,
            street, 
            city, 
            state,
            country,
            phone, 
            website, 
            description, 
            locationType, 
            operator, 
            machineList: this.props.location.machineList,
        }
        this.props.suggestLocation(locationDetails)
    } 

    getDisplayText = machine => (
        <Text style={{fontSize: 16}}>
            <Text style={{fontWeight: 'bold'}}>{machine.name}</Text>
            <Text>{` (${machine.manufacturer}, ${machine.year})`}</Text>
        </Text>
    )

    acceptError = () => {
        this.props.clearError()
        this.setState({ showSuggestLocationModal: false })
    }

    componentWillUnmount() {
        this.props.clearMachineList()
    }
     
    render(){
        const { 
            locationName,
            street, 
            city, 
            state,
            country,
            phone, 
            website, 
            description, 
            locationType, 
            operator, 
            showSelectLocationTypeModal, 
            showSelectOperatorModal,
            showSelectCountryModal,
            locationTypes,
            operators,
        } = this.state
        const { loggedIn } = this.props.user
        const { errorText } = this.props.error

        const { isSuggestingLocation, locationSuggested, machineList = [] } = this.props.location

        const locationTypeObj = locationTypes.find(type => type.id === locationType) || {}
        const { name: locationTypeName = 'Select location type' } = locationTypeObj

        const operatorObj = operators.find(op => op.id === operator) || {}
        const { name: operatorName = "Select operator" } = operatorObj

        return(
            <ScrollView style={{flex: 1}}>
                <ConfirmationModal 
                    visible={showSelectLocationTypeModal}
                >
                    <ScrollView>
                        <Picker 
                            selectedValue={locationType}
                            onValueChange={itemValue => this.setState({ locationType: itemValue })}>
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
                        onPress={() => this.setState({ showSelectLocationTypeModal: false, locationType: this.state.originalLocationType, originalLocationType: null })}
                    />
                </ConfirmationModal>
                <ConfirmationModal 
                    visible={showSelectOperatorModal}
                >
                    <ScrollView>
                        <Picker 
                            selectedValue={operator}
                            onValueChange={itemValue => this.setState({ operator: itemValue })}>
                            {operators.map(m => (
                                <Picker.Item label={m.name} value={m.id} key={m.id} />
                            ))}
                        </Picker>
                    </ScrollView>
                    <PbmButton
                        title={'OK'}
                        onPress={() => this.setState({ showSelectOperatorModal: false, originalOperator: null })}
                    />
                    <WarningButton 
                        title={'Cancel'}
                        onPress={() => this.setState({ showSelectOperatorModal: false, operator: this.state.originalOperator, originalOperator: null })}
                    />
                </ConfirmationModal>
                <ConfirmationModal 
                    visible={showSelectCountryModal}
                >
                    <ScrollView>
                        <Picker 
                            selectedValue={country}
                            onValueChange={country => this.setState({ country })}>
                            {countries.map(m => (
                                <Picker.Item label={m.name} value={m.name} key={m.name} />
                            ))}
                        </Picker>
                    </ScrollView>
                    <PbmButton
                        title={'OK'}
                        onPress={() => this.setState({ showSelectCountryModal: false })}
                    />
                    <WarningButton 
                        title={'Cancel'}
                        onPress={() => this.setState({ showSelectCountryModal: false })}
                    />
                </ConfirmationModal>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showSuggestLocationModal}
                    onRequestClose={()=>{}}
                >
                    {isSuggestingLocation ? 
                        <ActivityIndicator /> :
                        errorText ? 
                            <View style={{marginTop: 100}}>
                                <Text>{errorText}</Text>
                                <PbmButton 
                                    title={"OK"}
                                    onPress={() => this.acceptError()}
                                />
                            </View> :
                            locationSuggested ?
                                <View style={{marginTop: 100}}>
                                    <Text>Location Suggestion Received, thanks!</Text>
                                    <PbmButton 
                                        title={"OK"}
                                        onPress={() => this.setState({ showSuggestLocationModal: false })}
                                    />
                                </View>
                                :                       
                                <ScrollView style={{marginTop: 50}}>
                                    <Text style={s.title}>Location Name</Text>
                                    <Text style={s.preview}>{locationName}</Text>
                                    <View style={s.hr}></View>
                                    <Text style={s.title}>Street</Text>
                                    <Text style={s.preview}>{street}</Text>
                                    <View style={s.hr}></View>
                                    <Text style={s.title}>City</Text>
                                    <Text style={s.preview}>{city}</Text>
                                    <View style={s.hr}></View>
                                    <Text style={s.title}>State</Text>
                                    <Text style={s.preview}>{state}</Text>
                                    <View style={s.hr}></View>
                                    <Text style={s.title}>Country</Text>
                                    <Text style={s.preview}>{country}</Text>
                                    <View style={s.hr}></View>
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
                                    <Text style={s.preview}>{typeof locationType === 'number' ? locationTypes.filter(type => type.id === locationType).map(type => type.name) : 'None Selected'}</Text>
                                    <View style={s.hr}></View>
                                    <Text style={s.title}>Operator</Text>
                                    <Text style={s.preview}>{typeof operator === 'number' ? operators.filter(op=> op.id === operator).map(op => op.name) : 'None Selected'}</Text>
                                    <Text style={s.title}>Machine List</Text>
                                    {machineList.map(m => 
                                        <Text style={s.preview} key={m.name}>{m.name}</Text>
                                    )}
                                    <PbmButton
                                        title={'Submit Location'}
                                        onPress={() => this.confirmSuggestLocationDetails()}
                                    />
                                    <WarningButton
                                        title={'Cancel'}
                                        onPress={() => this.setState({ showSuggestLocationModal: false})}
                                    />
                                </ScrollView>
                    }
                </Modal>
                { loggedIn ?
                    <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
                        <View style={{marginLeft:10,marginRight:10}}>
                            <Text>{`Add a new location to the database. Fill in this form. We'll review it to make sure the data works... so don't expect it to show up just yet. Thanks for helping out!`}</Text>
                            <Text style={s.title}>Location Name</Text>
                            <TextInput
                                style={[{height: 40,textAlign:'center'},s.textInput]}
                                underlineColorAndroid='transparent'
                                onChangeText={locationName => this.setState({ locationName })}
                                value={locationName}
                                returnKeyType="done"
                                placeholder={'...'}
                            />
                            <Text style={s.title}>Street</Text>
                            <TextInput
                                style={[{height: 40,textAlign:'center'},s.textInput]}
                                underlineColorAndroid='transparent'
                                onChangeText={street => this.setState({ street })}
                                value={street}
                                returnKeyType="done"
                                placeholder={'...'}
                            />
                            <Text style={s.title}>City</Text>
                            <TextInput
                                style={[{height: 40,textAlign:'center'},s.textInput]}
                                underlineColorAndroid='transparent'
                                onChangeText={city => this.setState({ city })}
                                value={city}
                                returnKeyType="done"
                                placeholder={'...'}
                            />
                            <Text style={s.title}>State</Text>
                            <TextInput
                                style={[{height: 40,textAlign:'center'},s.textInput]}
                                underlineColorAndroid='transparent'
                                onChangeText={state => this.setState({ state })}
                                value={state}
                                returnKeyType="done"
                                placeholder={'...'}
                            />
                            <Text style={s.title}>Country</Text>
                            {Platform.OS === "ios" ? 
                                <DropDownButton
                                    title={country}
                                    onPress={() => this.setState({ showSelectCountryModal: true })}
                                /> :
                                <Picker 
                                    style={s.pickerbg}
                                    selectedValue={country}
                                    onValueChange={country => this.setState({ country })}>
                                    {countries.map(m => (
                                        <Picker.Item label={m.name} value={m.name} key={m.name} />
                                    ))}
                                </Picker>    
                            }   
                            <Text style={s.title}>Phone</Text>
                            <TextInput 
                                style={[{height: 40,textAlign:'center'},s.textInput]}
                                underlineColorAndroid='transparent'
                                onChangeText={phone => this.setState({ phone })}
                                value={phone}
                                returnKeyType="done"
                                placeholder={phone || '(503) xxx-xxxx'}
                            />
                            <Text style={s.title}>Website</Text>
                            <TextInput
                                style={[{height: 40,textAlign:'center'},s.textInput]}
                                underlineColorAndroid='transparent'
                                onChangeText={website => this.setState({ website })}
                                value={website}
                                returnKeyType="done"
                                placeholder={'http://...'}
                            />
                            <Text style={s.title}>Location Notes</Text>
                            <TextInput
                                multiline={true}
                                numberOfLines={4}
                                style={[{padding:5,height: 100},s.textInput]}
                                onChangeText={description => this.setState({ description })}
                                underlineColorAndroid='transparent'
                                value={description}
                                placeholder={'Location description...'}
                                textAlignVertical='top'
                            />
                            <Text style={s.title}>Location Type</Text>
                            {Platform.OS === "ios" ? 
                                <DropDownButton
                                    title={locationTypeName}
                                    onPress={() => this.selectingLocationType()}
                                /> : 
                                <Picker 
                                    style={s.pickerbg}
                                    selectedValue={locationType}
                                    onValueChange={itemValue => this.setState({ locationType: itemValue })}>
                                    {locationTypes.map(m => (
                                        <Picker.Item label={m.name} value={m.id} key={m.id} />
                                    ))}
                                </Picker>
                            }
                            <Text style={s.title}>Operator</Text>
                            {Platform.OS === "ios" ? 
                                <DropDownButton
                                    title={operatorName}
                                    onPress={() => this.selectingOperator()}
                                /> :
                                <Picker 
                                    style={s.pickerbg}
                                    selectedValue={operator}
                                    onValueChange={itemValue => this.setState({ operator: itemValue })}>
                                    {operators.map(m => (
                                        <Picker.Item label={m.name} value={m.id} key={m.id} />
                                    ))}
                                </Picker>    
                            }    
                            <PbmButton
                                title={'Select Machines to Add'}
                                onPress={() => this.props.navigation.navigate('FindMachine', { multiSelect: true })}
                            />   
                            {machineList.map(machine => 
                                <ListItem 
                                    title={this.getDisplayText(machine)}
                                    key={machine.id}
                                    checkmark={<MaterialIcons name='cancel' size={15} color="#4b5862" />}
                                    onPress={() => this.props.removeMachineFromList(machine)}
                                />
                            )}                 
                            <PbmButton
                                title={'Submit Location'}
                                onPress={() => this.setState({ showSuggestLocationModal: true })}
                            />
                        </View>
                    </TouchableWithoutFeedback> :
                    <NotLoggedIn
                        title={'Suggest a New Location'}
                        text={'But first! We ask that you Login. Thank you!'}
                        onPress={() => this.props.navigation.navigate('Login')}
                    />
                }

            </ScrollView>)
    }
}

const s = StyleSheet.create({ 
    title: {
        textAlign:'center',
        marginBottom: 5,
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold"
    },
    preview: {
        fontSize: 14,
        marginRight: 25,
        marginLeft: 25
    },
    textInput: {
        backgroundColor: '#f5fbfe', 
        borderColor: '#4b5862', 
        borderWidth: 2,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 5
    },
    pickerbg: {
        backgroundColor: '#f5fbfe',
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 2,
        borderColor: '#4b5862',
        borderRadius: 5
    },
    hr: {
        marginLeft:25,
        marginRight:25,
        height:2,
        marginTop: 10,
        backgroundColor:"#D3ECFF"
    },
})

SuggestLocation.propTypes = {
    error: PropTypes.object,
    locations: PropTypes.object,
    operators: PropTypes.object,
    user: PropTypes.object,
    navigation: PropTypes.object,
    location: PropTypes.object,
    clearError: PropTypes.func, 
    removeMachineFromList: PropTypes.func,
    clearMachineList: PropTypes.func,
    suggestLocation: PropTypes.func,
}

const mapStateToProps = ({ error, location, locations, operators, user }) => ({ error, location, locations, operators, user })
const mapDispatchToProps = (dispatch) => ({
    clearError: () => dispatch(clearError()),
    removeMachineFromList: machine => dispatch(removeMachineFromList(machine)),
    clearMachineList: () => dispatch(clearMachineList()),
    suggestLocation: (goBack, locationDetails) => dispatch(suggestLocation(goBack, locationDetails))
})
export default connect(mapStateToProps, mapDispatchToProps)(SuggestLocation)