import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { HeaderBackButton } from 'react-navigation'
import { ActivityIndicator, Modal, Picker, Text, TextInput, View, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { Button } from 'react-native-elements'

import { updateLocationDetails } from '../actions'
import { clearError } from '../actions'

class EditLocationDetails extends Component {
    constructor(props) {
        super(props)
        const { locationTypes }  = this.props.locations
        const { operators } = this.props.operators
        locationTypes.unshift({name: '', id: 'NONE' })
        operators.unshift({name: '', id: 'NONE' })

        this.state = {
            phone: props.location.location.phone,
            website: props.location.location.website, 
            description: props.location.location.description,
            selectedLocationType: props.location.location.location_type_id,
            selectedOperatorId: props.location.location.operator_id,
            locationTypes,
            operators,
            showEditLocationDetailsModal: false,
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#260204" onPress={() => navigation.goBack(null)} />,
            title: <Text>{navigation.getParam('name')}</Text>,
        }
    }

    confirmEditLocationDetails = () => {
        const { phone, website, description, selectedLocationType, selectedOperatorId } = this.state
        this.props.updateLocationDetails(this.props.navigation.goBack, phone, website, description, selectedLocationType, selectedOperatorId)
    }

    acceptError = () => {
        this.props.clearError()
        this.setState({ showEditLocationDetailsModal: false })
    }

    render(){
        const { phone, website, description, selectedLocationType, selectedOperatorId, locationTypes, operators } = this.state
        const { updatingLocationDetails } = this.props.location.location
        const { errorText } = this.props.error

        return(
            <ScrollView style={{ flex: 1 }}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showEditLocationDetailsModal}
                    onRequestClose={()=>{}}
                >
                    {errorText ? 
                        <View style={{marginTop: 100}}>
                            <Text>{errorText}</Text>
                            <Button 
                                title={"OK"}
                                onPress={() => this.acceptError()}
                            />
                        </View>
                        :                       
                        <ScrollView style={{marginTop: 50}}>
                            <Text style={s.title}>Phone</Text>
                            <Text style={s.preview}>{phone}</Text>
                            <Text style={s.title}>Website</Text>
                            <Text style={s.preview}>{website}</Text>
                            <Text style={s.title}>Location Notes</Text>
                            <Text style={s.preview}>{description}</Text>
                            <Text style={s.title}>Location Type</Text>
                            <Text style={s.preview}>{typeof selectedLocationType === 'number' ? locationTypes.filter(type => type.id === selectedLocationType).map(type => type.name) : 'None Selected'}</Text>
                            <Text style={s.title}>Operator</Text>
                            <Text style={s.preview}>{typeof selectedOperatorId === 'number' ? operators.filter(operator => operator.id === selectedOperatorId).map(operator => operator.name) : 'None Selected'}</Text>
                            <Button
                                title={'Confirm Details'}
                                onPress={() => this.confirmEditLocationDetails()}
                                raised
                                buttonStyle={s.blueButton}
                                titleStyle={s.titleStyle}
                                style={{borderRadius: 50}}
                                containerStyle={[{borderRadius:50},s.margin15]}
                            />
                            <Button
                                title={'Cancel'}
                                onPress={() => this.setState({ showEditLocationDetailsModal: false})}
                                raised
                                buttonStyle={s.redButton}
                                titleStyle={{fontSize:18,color:'#f53240'}}
                                style={{borderRadius: 50}}
                                containerStyle={[{borderRadius:50},s.margin10]}
                            />
                        </ScrollView>
                    }
                </Modal>
                {updatingLocationDetails ?  
                    <ActivityIndicator /> :
                    <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
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
                            <Picker style={s.pickerbg}
                                selectedValue={selectedLocationType}
                                onValueChange={itemValue => this.setState({ selectedLocationType: itemValue })}>
                                {locationTypes.map(m => (
                                    <Picker.Item label={m.name} value={m.id} key={m.id} />
                                ))}
                            </Picker>
                            <Text style={s.title}>Operator</Text>
                            <Picker style={s.pickerbg}
                                selectedValue={selectedOperatorId}
                                onValueChange={itemValue => this.setState({ selectedOperatorId: itemValue })}>
                                {operators.map(m => (
                                    <Picker.Item label={m.name} value={m.id} key={m.id} />
                                ))}
                            </Picker>                            
                            <Button
                                title={'Submit Location Details'}
                                onPress={() => this.setState({ showEditLocationDetailsModal: true })}
                                raised
                                buttonStyle={s.blueButton}
                                titleStyle={s.titleStyle}
                                style={{borderRadius: 50}}
                                containerStyle={[{borderRadius:50},s.margin15]}
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
        marginRight: 15,
        marginLeft: 15
    },
    blueButton: {
        backgroundColor:"#D3ECFF",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    redButton: {
        backgroundColor: "#fdd4d7",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    titleStyle: {
        color:"black",
        fontSize:18
    },
    textInput: {
        backgroundColor: '#f6f6f6', 
        borderColor: '#888888', 
        borderWidth: 2,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 5
    },
    margin15: {
        marginLeft:15,
        marginRight:15,
        marginTop:15,
        marginBottom:15
    },
    margin10: {
        marginLeft:15,
        marginRight:15,
        marginTop:10,
        marginBottom:15
    },
    pickerbg: {
        backgroundColor: '#f6f6f6',
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 2,
        borderColor: '#888888',
        borderRadius: 5
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
