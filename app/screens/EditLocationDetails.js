import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { HeaderBackButton } from 'react-navigation'
import { ActivityIndicator, Modal, Picker, Text, TextInput, View } from 'react-native'
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
            <View>
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
                        <View style={{paddingTop: 50}}>
                            <Text>Phone</Text>
                            <Text>{phone}</Text>
                            <Text>Website</Text>
                            <Text>{website}</Text>
                            <Text>Location Type</Text>
                            <Text>{typeof selectedLocationType === 'number' ? locationTypes.filter(type => type.id === selectedLocationType).map(type => type.name) : 'None Selected'}</Text>
                            <Text>{typeof selectedOperatorId === 'number' ? operators.filter(operator => operator.id === selectedOperatorId).map(operator => operator.name) : 'None Selected'}</Text>
                            <Text>Description</Text>
                            <Text>{description}</Text>
                            <Button
                                title={'Confirm Details'}
                                onPress={() => this.confirmEditLocationDetails()}
                            />
                            <Button
                                title={'Cancel'}
                                onPress={() => this.setState({ showEditLocationDetailsModal: false})}
                            />
                        </View>
                    }
                </Modal>
                {updatingLocationDetails ?  
                    <ActivityIndicator /> :
                    <View>
                        <Text>Phone</Text>
                        <TextInput 
                            keyboardType='numeric'
                            underlineColorAndroid='transparent'
                            onChangeText={phone => this.setState({ phone })}
                            value={phone}
                            returnKeyType="done"
                            placeholder={phone || '(503) xxx - xxxx'}
                        />
                        <Text>Website</Text>
                        <TextInput 
                            underlineColorAndroid='transparent'
                            onChangeText={website => this.setState({ website })}
                            value={website}
                            returnKeyType="done"
                            placeholder={website || 'www...'}
                        />
                        <Text>Location Type:</Text>
                        <Picker
                            selectedValue={selectedLocationType}
                            onValueChange={itemValue => this.setState({ selectedLocationType: itemValue })}>
                            {locationTypes.map(m => (
                                <Picker.Item label={m.name} value={m.id} key={m.id} />
                            ))}
                        </Picker>
                        <Text>Operator:</Text>
                        <Picker
                            selectedValue={selectedOperatorId}
                            onValueChange={itemValue => this.setState({ selectedOperatorId: itemValue })}>
                            {operators.map(m => (
                                <Picker.Item label={m.name} value={m.id} key={m.id} />
                            ))}
                        </Picker>
                        <Text>Description</Text>
                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={description => this.setState({ description })}
                            underlineColorAndroid='transparent'
                            value={description}
                            placeholder={description || 'Location description...'}
                            textAlignVertical='top'
                        />
                        <Button
                            title={'Submit Location Details'}
                            onPress={() => this.setState({ showEditLocationDetailsModal: true })}
                        />
                    </View>
                }
            </View>
        )
    }
}

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
