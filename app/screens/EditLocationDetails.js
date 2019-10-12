import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { 
    ActivityIndicator, 
    Keyboard,
    Modal, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    TextInput, 
    TouchableWithoutFeedback, 
    View, 
} from 'react-native'
import { 
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

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: navigation.getParam('name'),
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

        return(
            <Screen keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
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
                                textAlignVertical='top'
                            />
                            <Text style={s.title}>Location Type</Text>
                            <DropDownButton
                                title={locationTypeName}
                                onPress={() => navigate('FindLocationType', {type: 'search', setSelected: (id) => this.props.setSelectedLocationType(id)})}
                            /> 
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
            </Screen>
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
