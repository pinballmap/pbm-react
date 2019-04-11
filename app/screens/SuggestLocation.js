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
import { ListItem } from 'react-native-elements'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { 
    ConfirmationModal, 
    DropDownButton, 
    HeaderBackButton,
    NotLoggedIn, 
    PbmButton, 
    WarningButton,
    Text
} from '../components'
import { 
    clearError,
    clearMachineList, 
    removeMachineFromList,
    suggestLocation,
} from '../actions'
import countries from '../utils/countries'
import { ifIphoneX } from 'react-native-iphone-x-helper'

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
            zip: '',
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
            drawerIcon: () => <MaterialIcons name='add-location' style={[s.drawerIcon]} />,
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: 'Suggest Location',
            headerStyle: {
                backgroundColor:'#f5fbff',
                ...ifIphoneX({
                    paddingTop: 30,
                    height: 60
                }, {
                    paddingTop: 0
                })         
            },
            headerTintColor: '#4b5862'
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
            zip,
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
            zip,
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
            zip,
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
        const { navigate } = this.props.navigation

        const { isSuggestingLocation, locationSuggested, machineList = [] } = this.props.location

        const locationTypeObj = locationTypes.find(type => type.id === locationType) || {}
        const { name: locationTypeName = 'Select location type' } = locationTypeObj

        const operatorObj = operators.find(op => op.id === operator) || {}
        const { name: operatorName = "Select operator" } = operatorObj

        return(
            <ScrollView keyboardDismissMode="on-drag" style={{flex: 1,backgroundColor:'#f5fbff'}}>
                {!loggedIn ? 
                    <NotLoggedIn
                        title={'Suggest a New Location'}
                        text={'But first! We ask that you log in. Thank you!'}
                        onPress={() => navigate('Login')}
                    /> :
                    <View>
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
                                    <ScrollView style={{paddingTop: 100,backgroundColor:'#f5fbff'}}>
                                        <Text style={[s.error,s.success]}>{errorText}</Text>
                                        <PbmButton 
                                            title={"OK"}
                                            onPress={() => this.acceptError()}
                                        />
                                    </ScrollView> :
                                    locationSuggested ?
                                        <ScrollView style={{paddingTop: 100,backgroundColor:'#f5fbff'}}>
                                            <Text style={s.success}>{`Thanks for submitting that location! We'll review the submission and add it!`}</Text>
                                            <PbmButton 
                                                title={"OK"}
                                                onPress={() => {
                                                    this.setState({ showSuggestLocationModal: false })
                                                    navigate('Map')
                                                }}
                                            />
                                        </ScrollView>
                                        :        
                                        <SafeAreaView style={{flex: 1,backgroundColor:'#f5fbff'}}>               
                                            <ScrollView style={{backgroundColor:'#f5fbff'}}>
                                                <View style={s.pageTitle}>
                                                    {machineList.length === 0 || locationName.length === 0 ? 
                                                        <Text style={[s.pageTitleText,s.errorTitle]}>Please fill in required fields</Text> 
                                                        : <Text style={s.pageTitleText}>Please review your submission</Text>
                                                    }
                                                </View>
                                                <Text style={s.title}>Location Name</Text>
                                                {locationName.length === 0 ?
                                                    <Text style={[s.error,s.preview]}>Include a location name</Text>
                                                    : <Text style={s.preview}>{locationName}</Text>
                                                }
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
                                                <Text style={s.title}>Zip</Text>
                                                <Text style={s.preview}>{zip}</Text>
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
                                                <View style={s.hr}></View>
                                                <Text style={s.title}>Machine List</Text>
                                                {machineList.length === 0 ? 
                                                    <Text style={[s.error,s.preview]}>Include at least one machine</Text> 
                                                    : machineList.map(m => 
                                                        <Text style={s.preview} key={m.name}>{m.name} ({m.manufacturer}, {m.year})</Text>
                                                    )
                                                }                             
                                                <PbmButton
                                                    title={'Submit Location'}
                                                    onPress={() => this.confirmSuggestLocationDetails()}
                                                    disabled={machineList.length === 0 || locationName.length === 0}
                                                />
                                                <WarningButton
                                                    title={'Cancel'}
                                                    onPress={() => this.setState({ showSuggestLocationModal: false})}
                                                />
                                            </ScrollView>
                                        </SafeAreaView>
                            }
                        </Modal>
                        <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>
                            <View style={{marginLeft:10,marginRight:10,marginTop:5}}>
                                <Text>{`Submit a new location to the map! We review all submissions. Thanks for helping out!`}</Text>
                                <Text style={s.title}>Location Name</Text>
                                <TextInput
                                    style={[{height: 40,textAlign:'left'},s.textInput,s.radius50]}
                                    underlineColorAndroid='transparent'
                                    onChangeText={locationName => this.setState({ locationName })}
                                    value={locationName}
                                    returnKeyType="done"
                                    placeholder={"ex. Giovanni's Pizza"}
                                />
                                <Text style={s.title}>Street</Text>
                                <TextInput
                                    style={[{height: 40,textAlign:'left'},s.textInput,s.radius50]}
                                    underlineColorAndroid='transparent'
                                    onChangeText={street => this.setState({ street })}
                                    value={street}
                                    returnKeyType="done"
                                    placeholder={'ex. 123 Coast Village Road'}
                                />
                                <Text style={s.title}>City</Text>
                                <TextInput
                                    style={[{height: 40,textAlign:'left'},s.textInput,s.radius50]}
                                    underlineColorAndroid='transparent'
                                    onChangeText={city => this.setState({ city })}
                                    value={city}
                                    returnKeyType="done"
                                    placeholder={'ex. Montecito'}
                                />
                                <Text style={s.title}>State</Text>
                                <TextInput
                                    style={[{height: 40,textAlign:'left'},s.textInput,s.radius50]}
                                    underlineColorAndroid='transparent'
                                    onChangeText={state => this.setState({ state })}
                                    value={state}
                                    returnKeyType="done"
                                    placeholder={'ex. CA'}
                                />
                                <Text style={s.title}>Zip Code</Text>
                                <TextInput
                                    style={[{height: 40,textAlign:'left'},s.textInput,s.radius50]}
                                    underlineColorAndroid='transparent'
                                    onChangeText={zip => this.setState({ zip })}
                                    value={zip}
                                    returnKeyType="done"
                                    placeholder={'ex. 93108'}
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
                                    style={[{height: 40,textAlign:'left'},s.textInput,s.radius50]}
                                    underlineColorAndroid='transparent'
                                    onChangeText={phone => this.setState({ phone })}
                                    value={phone}
                                    returnKeyType="done"
                                    placeholder={phone || '(503) xxx-xxxx'}
                                />
                                <Text style={s.title}>Website</Text>
                                <TextInput
                                    style={[{height: 40,textAlign:'left'},s.textInput,s.radius50]}
                                    underlineColorAndroid='transparent'
                                    onChangeText={website => this.setState({ website: website ? website[0].toLowerCase() + website.slice(1) : '' })}
                                    value={website}
                                    returnKeyType="done"
                                    placeholder={'http://...'}
                                />
                                <Text style={s.title}>Location Notes</Text>
                                <TextInput
                                    multiline={true}
                                    numberOfLines={4}
                                    style={[{padding:5,height: 100},s.textInput,s.radius10]}
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
                                    onPress={() => navigate('FindMachine', { multiSelect: true })}
                                    icon={<MaterialCommunityIcons name='plus' style={s.plusButton} />}
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
                        </TouchableWithoutFeedback>
                    </View>}
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
        fontSize: 15,
        marginRight: 25,
        marginLeft: 25
    },
    pageTitle: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#6a7d8a"
    },
    pageTitleText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 18,
        color: '#f5fbff'
    },
    textInput: {
        backgroundColor: '#ffffff', 
        borderColor: '#97a5af', 
        borderWidth: 2,
        marginLeft: 15,
        marginRight: 15,
        paddingLeft: 10,
        paddingRight: 5
    },
    radius50: {
        borderRadius: 50,
    },
    radius10: {
        borderRadius: 10,
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
    success: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
        marginRight: 10
    },
    error: {
        color: '#F53240'
    },
    errorTitle: {
        color: '#fdd4d7'
    },
    plusButton: {
        color: "#f53240",
        fontSize: 24
    },
    drawerIcon: {
        fontSize: 24,
        color: '#6a7d8a'
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