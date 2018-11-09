import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { ActivityIndicator, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { HeaderBackButton } from 'react-navigation'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { Button, ButtonGroup, ListItem } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { fetchLocation } from '../actions/location_actions'
import { closeConfirmModal, confirmLocationIsUpToDate, setCurrentMachine } from '../actions/location_actions'
import { clearError } from '../actions/error_actions'
import { getDistance } from '../utils/utilityFunctions'

const moment = require('moment')

class LocationDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.navigation.state.params['id'] ? this.props.navigation.state.params['id'] : this.props.query.locationId,
            buttonIndex: 0,
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#260204" onPress={() => navigation.goBack(null)} />,
            title: <Text>{navigation.getParam('locationName')}</Text>,
        }
    };

    updateIndex = buttonIndex => {
        this.setState({ buttonIndex })
    }

    getTitle = machine => (
        <Text style={{marginTop:5,marginBottom:0}}>
            <Text style={s.machineName}>{machine.name}</Text>
            {machine.year && <Text style={[s.machineMeta,s.italic]}>{` (${machine.manufacturer && machine.manufacturer + ", "}${machine.year})`}</Text>}
        </Text>
    )

    handleConfirmPress = id => {
        const { email, username, authentication_token } = this.props.user
        const body = {
            user_email: email,
            user_token: authentication_token,
        }
        this.props.confirmLocationIsUpToDate(body, id, username)
    }

    UNSAFE_componentWillReceiveProps(props) {
        if (this.props.location.addingMachineToLocation && !props.location.addingMachineToLocation)
            this.props.fetchLocation(this.state.id)
    }
            
    componentDidMount() {
        this.props.fetchLocation(this.state.id)
    }

    render() {
        if (this.props.location.isFetchingLocation || !this.props.location.location.id || this.props.location.addingMachineToLocation) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }

        const location = this.props.location.location
        const { errorText } = this.props.error
        const errorModalVisible = errorText && errorText.length > 0 ? true : false

        return (
            <ScrollView style={{ flex: 1 }}>
                <Modal 
                    visible={errorModalVisible}
                >
                    <View style={{marginTop: 100}}>
                        <Text>{errorText}</Text>
                        <Button 
                            title={"OK"}
                            onPress={this.props.clearError}
                        />
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.props.location.confirmModalVisible}
                    onRequestClose={()=>{}}
                >
                    <View style={{marginTop: 100}}>
                        <Text style={s.confirmText}>{this.props.location.confirmationMessage}</Text>
                        <View> 
                            <Button
                                title={"You're Welcome"}
                                onPress={this.props.closeConfirmModal}
                                accessibilityLabel="You're Welcome"
                                raised
                                buttonStyle={s.buttonPink}
                                titleStyle={{
                                    color:"black", 
                                    fontSize:18
                                }}
                                style={{borderRadius: 50}}
                                containerStyle={{marginTop:20,marginBottom:10,marginRight:20,marginLeft:20,borderRadius:50}}
                            />
                        </View>
                        <View style={s.logoWrapper}>
                            <Image source={require('../assets/images/PPM-Splash-200.png')} style={s.logo}/>
                        </View>
                    </View>
                </Modal>
                <View style={{ flex: 1, position: 'relative' }}>
                    <MapView
                        region={{
                            latitude: Number(location.lat),
                            longitude: Number(location.lon),
                            latitudeDelta: 0.03,
                            longitudeDelta: 0.03
                        }}
                        style={s.map}
                        provider={PROVIDER_GOOGLE}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: Number(location.lat),
                                longitude: Number(location.lon),
                                latitudeDelta: 0.03,
                                longitudeDelta: 0.03,
                            }}
                        />
                    </MapView>
                    <View style={{ flex: 3 }}>
                        <ButtonGroup
                            onPress={this.updateIndex}
                            selectedIndex={this.state.buttonIndex}
                            buttons={['Machines', 'Info']}
                            containerStyle={{ height: 30 }}
                            selectedButtonStyle={s.buttonStyle}
                            selectedTextStyle={s.textStyle}
                        />
                        {this.state.buttonIndex === 0 ?
                            <View>
                                {location.date_last_updated && <Text style={s.lastUpdated}>Last Updated: {moment(location.date_last_updated, 'YYYY-MM-DD').format('MMM-DD-YYYY')}{location.last_updated_by_user_id  && ` by` }<Text style={s.textStyle}>{` ${location.last_updated_by_username}`}</Text></Text>}
                                <View>
                                    <Button
                                        onPress={() => this.props.user.loggedIn ? this.props.navigation.navigate('FindMachine') : this.props.navigation.navigate('SignupLogin') }
                                        icon={<MaterialCommunityIcons name='plus' style={s.plusButton} />}
                                        title={this.props.user.loggedIn ? 'Add Machine' : 'Login to Add Machine'}
                                        accessibilityLabel="Add Machine"
                                        raised
                                        buttonStyle={s.addButton}
                                        titleStyle={{
                                            color:"black", 
                                            fontSize:18
                                        }}
                                        style={{borderRadius: 50}}
                                        containerStyle={{marginTop:5,marginBottom:5,marginRight:10,marginLeft:10,borderRadius:50}}
                                    />
                                    <Button
                                        onPress={() => this.handleConfirmPress(location.id)}
                                        title={'Confirm machine list is up to date'}
                                        accessibilityLabel="Confirm machine list is up to date"
                                        raised
                                        buttonStyle={s.confirmButton}
                                        titleStyle={{
                                            color:"#260204",
                                            fontSize:16
                                        }}
                                        style={{borderRadius: 5}}
                                        containerStyle={{marginTop:5,marginBottom:10,marginRight:25,marginLeft:25}}
                                    />
                                </View>
                                {location.location_machine_xrefs.map(machine => {
                                    const m = this.props.machines.machines.find(m => m.id === machine.machine_id)
        
                                    if (m) 
                                        return (
                                            <TouchableOpacity
                                                key={machine.machine_id} 
                                                onPress={() => {
                                                    this.props.navigation.navigate('MachineDetails', {machineName: m.name, locationName: location.name})
                                                    this.props.setCurrentMachine(machine.id)
                                                }}>
                                                <ListItem
                                                    title={this.getTitle(m)}
                                                    subtitle={
                                                        <View style={s.condition}>
                                                            {machine.condition && <Text style={s.conditionText}>"{machine.condition.length < 200 ? machine.condition : `${machine.condition.substr(0, 200)}...`}"</Text>}
                                                            {machine.condition_date && <Text>{`Last Updated: ${moment(machine.condition_date, 'YYYY-MM-DD').format('MMM-DD-YYYY')} ${machine.last_updated_by_username && `by ${machine.last_updated_by_username}`}`}</Text>}
                                                        </View>
                                                    }
                                                    rightElement = {<Ionicons style={s.iconStyle} name="ios-arrow-dropright" />}
                                                />
                                                <View
                                                    style={{
                                                        borderBottomColor: '#D3ECFF',
                                                        borderBottomWidth: 1,
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        )
                                })}
                            </View> :
                            <View style={s.locationMeta}>
                                <Text style={[s.street,s.font18]}>{location.street}</Text>
                                <Text style={[s.city,s.font18,s.marginB8]}>{location.city}, {location.state} {location.zip}</Text>
                                {this.props.user.lat && this.props.user.lon && <Text style={[s.font18,s.marginB8,s.italic]}>Distance:<Text style={s.notItalic}> {getDistance(this.props.user.lat, this.props.user.lon, location.lat, location.lon).toFixed(2)} mi</Text></Text>}
                                
                                {location.phone && <Text style={[s.phone,s.font18,s.marginB8]} 
                                    onPress={() => Linking.openURL(`tel:${location.phone}`)}>
                                    {location.phone}</Text>}

                                {location.website && <Text style={[s.website,s.font18,s.marginB8]}
                                    onPress={() => Linking.openURL(location.website)}
                                >Website</Text>}
                                
                                {location.location_type_id && <Text style={[s.meta,s.italic,s.marginB8]}>Location Type: <Text style={s.notItalic}>
                                    {this.props.locations.locationTypes.find(type => type.id === location.location_type_id).name}
                                </Text></Text>}

                                {location.operator_id && <Text style={[s.meta,s.italic,s.marginB8]}>Operated by: 
                                    <Text style={s.notItalic}>
                                        {` ${this.props.operators.operators.find(operator => operator.id === location.operator_id).name}`}
                                    </Text></Text>}

                                {location.description && <Text style={[s.meta,s.italic]}>
                                    Location Notes: <Text style={s.notItalic}>{location.description}</Text></Text>}                                   

                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const s = StyleSheet.create({
    map: {
        height: 100
    },
    buttonStyle: {
        backgroundColor: '#D3ECFF',
    },
    textStyle: {
        color: '#000000',
        fontWeight: 'bold',
    },
    machineName: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 18,
    },
    machineMeta: {
        fontSize: 16
    },
    locationMeta: {
        marginLeft: 10,
        marginRight: 10
    },
    font18: {
        fontSize: 18
    },
    marginB8: {
        marginBottom: 8
    },
    street: {
        fontWeight: 'bold'
    },
    phone: {
        textDecorationLine: 'underline'
    },
    website: {
        textDecorationLine: 'underline'
    },
    italic: {
        fontStyle: 'italic',
        color: '#444444'
    },
    notItalic: {
        fontStyle: 'normal'
    },
    meta: {
        fontSize: 16,
        color: '#666666'
    },
    iconStyle: {
        fontSize: 32,
        color: '#cccccc',
    },
    addButton: {
        backgroundColor:"#D3ECFF",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    buttonPink: {
        backgroundColor:"#fdd4d7",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    confirmButton: {
        backgroundColor:"#dddddd",
        width: '100%',
        elevation: 0
    },
    condition: {
        marginTop: 10
    },
    conditionText: {
        color: '#888888',
        fontSize: 14,
        fontStyle: 'italic',
        marginLeft: 5
    },
    lastUpdated: {
        textAlign: 'center',
    },
    plusButton: {
        color: "#F53240",
        fontSize: 24
    },
    confirmText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
        marginRight: 10
    },
    logo: {
        resizeMode: 'contain',
        borderColor: "#fdd4d7",
        borderWidth: 5
    },
    logoWrapper: {
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

LocationDetails.propTypes = {
    confirmLocationIsUpToDate: PropTypes.func,
    fetchLocation: PropTypes.func,
    location: PropTypes.object,
    locations: PropTypes.object,
    operators: PropTypes.object,
    machines: PropTypes.object,
    query: PropTypes.object,
    user: PropTypes.object,
    closeConfirmModal: PropTypes.func,
    setCurrentMachine: PropTypes.func,
    navigation: PropTypes.object,
    clearError: PropTypes.func,
    error: PropTypes.object,
}

const mapStateToProps = ({ error, location, locations, operators, machines, query, user }) => ({ error, location, locations, operators, machines, query, user})
const mapDispatchToProps = (dispatch) => ({
    fetchLocation: url => dispatch(fetchLocation(url)),
    confirmLocationIsUpToDate: (body, id, username) => dispatch(confirmLocationIsUpToDate(body, id, username)),
    closeConfirmModal: () => dispatch(closeConfirmModal()),
    setCurrentMachine: id => dispatch(setCurrentMachine(id)),
    clearError: () => dispatch(clearError()),
})
export default connect(mapStateToProps, mapDispatchToProps)(LocationDetails)
