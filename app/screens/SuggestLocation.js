import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Picker, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native'
import { HeaderBackButton } from 'react-navigation'
import { ConfirmationModal, DropDownButton, NotLoggedIn, PbmButton, WarningButton } from '../components'

const DismissKeyboard = require('dismissKeyboard')

class SuggestLocation extends Component {
    constructor(props) {
        super(props)
        const { locationTypes }  = this.props.locations
        const { operators } = this.props.operators
        locationTypes.unshift({name: 'N/A', id: '' })
        operators.unshift({name: 'N/A', id: '' })

        this.state = {
            phone: '',
            website: '', 
            description: '',
            locationType: null,
            operator: null, 
            showSelectLocationTypeModal: false,
            originalLocationType: '',
            showSelectOperatorModal: false, 
            originalOperator: '',
            locationTypes,
            operators,
        }
    }
  
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'Suggest Location', 
            headerLeft: <HeaderBackButton tintColor="#000e18" onPress={() => navigation.goBack(null)} title="Map" />,
            title: 'Suggest Location',
        }
    }

    selectingLocationType = () => {
        this.setState({ showSelectLocationTypeModal: true, originalLocationType: this.state.locationType })
    }

    selectingOperator = () => {
        this.setState({ showSelectOperatorModal: true, originalOperator: this.state.operator })
    }
     
    render(){
        const { 
            phone, 
            website, 
            description, 
            locationType, 
            operator, 
            showSelectLocationTypeModal, 
            showSelectOperatorModal,
            locationTypes,
            operators,
        } = this.state
        const { loggedIn } = this.props.user

        const locationTypeObj = locationTypes.find(type => type.id === locationType) || {}
        const { name: locationTypeName = 'Select location type' } = locationTypeObj

        const operatorObj = operators.find(operator => operator.id === operator) || {}
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
                        onPress={() => this.setState({ showSelectOperatorModal: false, selectedOperatorId: this.state.originalOperator, originalOperator: null })}
                    />
                </ConfirmationModal>
                { loggedIn ?
                    <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
                        <View style={{marginLeft:10,marginRight:10}}>
                            <Text>{`Add a new location to the database. Fill in this form. We'll review it to make sure the data works... so don't expect it to show up just yet. Thanks for helping out!`}</Text>
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
                                    selectedValue={locationType}
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
                                    selectedValue={operator}
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

})

SuggestLocation.propTypes = {
    locations: PropTypes.object,
    operators: PropTypes.object,
    user: PropTypes.object,
    navigation: PropTypes.object,
}

const mapStateToProps = ({ locations, operators, user }) => ({ locations, operators, user })
const mapDispatchToProps = (dispatch) => ({
})
export default connect(mapStateToProps, mapDispatchToProps)(SuggestLocation)