import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { ActivityIndicator, Modal, Picker, Platform, TextInput, View, ScrollView, SafeAreaView, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { 
    ConfirmationModal, 
    DropDownButton, 
    HeaderBackButton,
    PbmButton, 
    WarningButton, 
    Text 
} from '../components'
import { clearError, updateLocationDetails } from '../actions'

class EditLocationDetails extends Component {
    constructor(props) {
        super(props)
        const { locationTypes }  = this.props.locations
        const { operators } = this.props.operators
        locationTypes.unshift({name: 'None Selected', id: '' })
        operators.unshift({name: 'None Selected', id: '' })

        this.state = {
            phone: props.location.location.phone,
            website: props.location.location.website, 
            description: props.location.location.description,
            selectedLocationType: props.location.location.location_type_id,
            selectedOperatorId: props.location.location.operator_id,
            locationTypes,
            operators,
            showEditLocationDetailsModal: false,
            showSelectLocationTypeModal: false,
            showSelectOperatorModal: false, 
            originalLocationType: null,
            originalOperator: null,
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: <Text>{navigation.getParam('name')}</Text>,
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

    confirmEditLocationDetails = () => {
        const { phone, website, description, selectedLocationType, selectedOperatorId } = this.state
        this.props.updateLocationDetails(this.props.navigation.goBack, phone, website, description, selectedLocationType, selectedOperatorId)
    }

    selectingLocationType = () => {
        this.setState({ showSelectLocationTypeModal: true, originalLocationType: this.state.selectedLocationType })
    }

    selectingOperator = () => {
        this.setState({ showSelectOperatorModal: true, originalOperator: this.state.selectedOperatorId})
    }

    acceptError = () => {
        this.props.clearError()
        this.setState({ showEditLocationDetailsModal: false })
    }

    render(){
        const { phone, website, description, selectedLocationType, selectedOperatorId, locationTypes, operators } = this.state
        const { updatingLocationDetails } = this.props.location.location
        const { errorText } = this.props.error

        const locationTypeObj = locationTypes.find(type => type.id === selectedLocationType) || {}
        const { name: locationTypeName = 'Select location type' } = locationTypeObj

        const operatorObj = operators.find(operator => operator.id === selectedOperatorId) || {}
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
                <ConfirmationModal 
                    visible={this.state.showSelectOperatorModal}
                >
                    <ScrollView>
                        <Picker 
                            selectedValue={selectedOperatorId}
                            onValueChange={itemValue => this.setState({ selectedOperatorId: itemValue })}>
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
                        onPress={() => this.setState({ showSelectOperatorModal: false, selectedOperatorId: this.state.originalOperator, originalOperator: null })}
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
                                <Text style={s.preview}>{typeof selectedOperatorId === 'number' ? operators.filter(operator => operator.id === selectedOperatorId).map(operator => operator.name) : 'None Selected'}</Text>
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
                                style={[{height: 40,textAlign:'center'},s.textInput]}
                                keyboardType='numeric'
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
                                placeholder={website || 'http://...'}
                            />
                            <Text style={s.title}>Location Notes</Text>
                            <TextInput
                                multiline={true}
                                numberOfLines={4}
                                style={[{padding:5,height: 100},s.textInput]}
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
                                <Picker 
                                    style={s.pickerbg}
                                    selectedValue={selectedLocationType}
                                    onValueChange={itemValue => this.setState({ selectedLocationType: itemValue })}>
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
                                    selectedValue={selectedOperatorId}
                                    onValueChange={itemValue => this.setState({ selectedOperatorId: itemValue })}>
                                    {operators.map(m => (
                                        <Picker.Item label={m.name} value={m.id} key={m.id} />
                                    ))}
                                </Picker>    
                            }                        
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
        fontWeight: "bold"
    },
    preview: {
        fontSize: 14,
        marginRight: 25,
        marginLeft: 25
    },
    textInput: {
        backgroundColor: '#f5fbfe', 
        borderColor: '#97a5af', 
        borderWidth: 2,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 5
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
})

EditLocationDetails.propTypes = {
    locations: PropTypes.object, 
    location: PropTypes.object, 
    operators: PropTypes.object,
    error: PropTypes.object,
    updateLocationDetails: PropTypes.func,
    clearError: PropTypes.func,
    navigation: PropTypes.object,
}

const mapStateToProps = ({ error, locations, location, operators }) => ({ error, locations, location, operators })
const mapDispatchToProps = dispatch => ({
    updateLocationDetails: (goBack, phone, website, description, selectedLocationType, selectedOperatorId) => dispatch(updateLocationDetails(goBack, phone, website, description, selectedLocationType, selectedOperatorId)),
    clearError: () => dispatch(clearError()),
})
export default connect(mapStateToProps, mapDispatchToProps)(EditLocationDetails)
