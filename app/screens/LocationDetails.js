import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { ActivityIndicator, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native'
import { HeaderBackButton } from 'react-navigation'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { Button, ButtonGroup, ListItem } from 'react-native-elements'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { ConfirmationModal, PbmButton } from '../components'
import { 
    addFavoriteLocation,
    clearError,
    closeConfirmModal, 
    closeFavoriteLocationModal, 
    confirmLocationIsUpToDate, 
    fetchLocation,
    removeFavoriteLocation,
    setCurrentMachine, 
} from '../actions'

import { alphaSortNameObj, getDistance } from '../utils/utilityFunctions'


const moment = require('moment')

let deviceWidth = Dimensions.get('window').width

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
            headerLeft: <HeaderBackButton tintColor="#000e18" onPress={() => navigation.goBack(null)} />,
            title: <Text>{navigation.getParam('locationName')}</Text>,
            headerTitleStyle: {width:deviceWidth - 100},
            headerRight: navigation.getParam('loggedIn') && navigation.getParam('buttonIndex') === 1 ?
                <Button
                    onPress={() => navigation.navigate('EditLocationDetails', {name: navigation.getParam('locationName')})}
                    containerStyle={{width:50}}
                    title="Edit"
                    accessibilityLabel="Edit"
                    titleStyle={{color: "#F53240", fontSize: 18}}
                    clear={true}
                /> : null
        }
    }

    updateIndex = buttonIndex => {
        this.setState({ buttonIndex })
        buttonIndex === 1 ? this.props.navigation.setParams({buttonIndex: 1}) : this.props.navigation.setParams({buttonIndex: 0})
    }

    getTitle = machine => (
        <Text style={{marginTop:5,marginBottom:0}}>
            <Text style={s.machineName}>{machine.name}</Text>
            {machine.year ? <Text style={[s.machineMeta,s.italic]}>{` (${machine.manufacturer && machine.manufacturer + ", "}${machine.year})`}</Text> : null}
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
        this.props.navigation.setParams({loggedIn: this.props.user.loggedIn, buttonIndex: 0})
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
        const { loggedIn, faveLocations, favoriteModalVisible, favoriteModalText, addingFavoriteLocation, removingFavoriteLocation, lat: userLat, lon: userLon, locationTrackingServicesEnabled } = this.props.user
        const isUserFave = faveLocations.some(fave => fave.location_id === location.id)
        const sortedMachines = alphaSortNameObj(location.location_machine_xrefs.map(machine => {
            const machineDetails = this.props.machines.machines.find(m => m.id === machine.machine_id)
            return {...machineDetails, ...machine}
        }))

        return (
            <ScrollView style={{ flex: 1, backgroundColor: "#ffffff" }}>
                <ConfirmationModal visible={favoriteModalVisible}>
                    {addingFavoriteLocation || removingFavoriteLocation ?
                        <ActivityIndicator /> : 
                        <View>
                            <Text style={s.confirmText}>{favoriteModalText}</Text> 
                            <View> 
                                <PbmButton
                                    title={"Great!"}
                                    onPress={this.props.closeFavoriteLocationModal}
                                    accessibilityLabel="Great!"
                                />
                                <Button 
                                    title={'View Saved Locations'}
                                    onPress={() => {
                                        this.props.closeFavoriteLocationModal()
                                        this.props.navigation.navigate('Saved')
                                    }}
                                    buttonStyle={s.savedLink}
                                    titleStyle={{
                                        color:"#000e18", 
                                        fontSize:16
                                    }}
                                    iconLeft
                                    icon={<FontAwesome name="heart-o" style={s.savedIcon} />}
                                    containerStyle={{marginTop:10,marginBottom:10,marginRight:20,marginLeft:20}}
                                />
                            </View>
                        </View>
                    }
                </ConfirmationModal>
                <Modal 
                    visible={errorModalVisible}
                    onRequestClose={()=>{}}
                >
                    <View style={{marginTop: 100}}>
                        <Text>{errorText}</Text>
                        <Button 
                            title={"OK"}
                            onPress={this.props.clearError}
                        />
                    </View>
                </Modal>
                <ConfirmationModal visible={this.props.location.confirmModalVisible}>
                    <Text style={s.confirmText}>{this.props.location.confirmationMessage}</Text>
                    <View> 
                        <PbmButton
                            title={"You're Welcome"}
                            onPress={this.props.closeConfirmModal}
                            accessibilityLabel="You're Welcome"
                        />
                    </View>
                    <View style={s.logoWrapper}>
                        <Image source={require('../assets/images/PPM-Splash-200.png')} style={s.logo}/>
                    </View>
                </ConfirmationModal>
                <View style={{ flex: 1, position: 'relative' }}>
                    {loggedIn && isUserFave && <FontAwesome style={s.saveLocation} name="heart" onPress={() => this.props.removeFavoriteLocation(location.id)}/>}
                    {loggedIn && !isUserFave && <FontAwesome style={s.saveLocation} name="heart-o" onPress={() => this.props.addFavoriteLocation(location.id)}/>}
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
                    <View style={{ flex: 3,backgroundColor: "#ffffff" }}>
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
                                {location.date_last_updated && <Text style={s.lastUpdated}>Last Updated: {moment(location.date_last_updated, 'YYYY-MM-DD').format('MMM-DD-YYYY')}{location.last_updated_by_user_username  && ` by` }<Text style={s.textStyle}>{` ${location.last_updated_by_username}`}</Text></Text>}
                                <View>
                                    <PbmButton
                                        onPress={() => loggedIn ? this.props.navigation.navigate('FindMachine') : this.props.navigation.navigate('SignupLogin') }
                                        icon={<MaterialCommunityIcons name='plus' style={s.plusButton} />}
                                        title={loggedIn ? 'Add Machine' : 'Login to Add Machine'}
                                        accessibilityLabel="Add Machine"
                                    />
                                    <Button
                                        onPress={() => this.handleConfirmPress(location.id)}
                                        title={'Confirm machine list is up to date'}
                                        accessibilityLabel="Confirm machine list is up to date"
                                        raised
                                        buttonStyle={s.confirmButton}
                                        titleStyle={{
                                            color:"#000e18",
                                            fontSize:16
                                        }}
                                        style={{borderRadius: 5}}
                                        containerStyle={{marginTop:5,marginBottom:10,marginRight:25,marginLeft:25}}
                                    />
                                </View>
                                {sortedMachines.map(machine => (
                                    <TouchableOpacity
                                        key={machine.id} 
                                        onPress={() => {
                                            this.props.navigation.navigate('MachineDetails', {machineName: machine.name, locationName: location.name})
                                            this.props.setCurrentMachine(machine.id)
                                        }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#D3ECFF',
                                                borderBottomWidth: 1,
                                            }}
                                        />
                                        <ListItem
                                            title={this.getTitle(machine)}
                                            subtitle={
                                                <View style={s.condition}>
                                                    {machine.condition ? <Text style={s.conditionText}>{`"${machine.condition.length < 100 ? machine.condition : `${machine.condition.substr(0, 100)}...`}"`}</Text> : null}
                                                    {machine.condition_date ? <Text>{`Last Updated: ${moment(machine.condition_date, 'YYYY-MM-DD').format('MMM-DD-YYYY')} ${machine.last_updated_by_username && `by ${machine.last_updated_by_username}`}`}</Text> : null}
                                                </View>
                                            }
                                            rightElement = {<Ionicons style={s.iconStyle} name="ios-arrow-dropright" />}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View> :            
                            <View style={s.locationMeta}>
                                <Text style={[s.street,s.font18]}>{location.street}</Text>
                                <Text style={[s.city,s.font18,s.marginB8]}>{location.city}, {location.state} {location.zip}</Text>
                                
                                {(locationTrackingServicesEnabled || location.location_type_id || location.phone || location.website || location.operator_id || location.description) && <View style={s.hr}></View>}

                                {location.location_type_id || locationTrackingServicesEnabled ? 
                                    <Text style={[s.meta,s.marginB8]}>
                                        {location.location_type_id ? <Text>{this.props.locations.locationTypes.find(type => type.id === location.location_type_id).name}</Text>: null}
                                        {location.location_type_id && locationTrackingServicesEnabled ? <Text> • </Text> : null }
                                        {locationTrackingServicesEnabled && <Text>{getDistance(userLat, userLon, location.lat, location.lon).toFixed(2)} mi</Text>}
                                    </Text>: null 
                                }
                                
                                {location.phone ? <Text style={[s.link,s.marginB8]} 
                                    onPress={() => Linking.openURL(`tel:${location.phone}`)}>
                                    {location.phone}</Text> : null}

                                {location.website ? <Text style={[s.link,s.marginB8]}
                                    onPress={() => Linking.openURL(location.website)}
                                >Website</Text> : null}                               

                                {location.operator_id ? <Text style={[s.meta,s.italic,s.marginB8]}>Operated by: 
                                    <Text style={s.notItalic}>
                                        {` ${this.props.operators.operators.find(operator => operator.id === location.operator_id).name}`}
                                    </Text></Text> : null}

                                {location.description ? <Text style={[s.meta,s.italic]}>
                                    Location Notes: <Text style={s.notItalic}>{location.description}</Text></Text> : null}                                   

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
        zIndex: -1,
        height: 100
    },
    buttonStyle: {
        backgroundColor: '#D3ECFF',
    },
    textStyle: {
        color: '#000e18',
        fontWeight: 'bold',
    },
    machineName: {
        color: '#000e18',
        fontWeight: 'bold',
        fontSize: 18,
    },
    machineMeta: {
        fontSize: 16
    },
    locationMeta: {
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 5,
        marginTop: 5,
    },
    hr: {
        marginLeft:25,
        marginRight:25,
        height:2,
        marginBottom:5,
        backgroundColor:"#D3ECFF"
    },
    font18: {
        fontSize: 18
    },
    font16: {
        fontSize: 16
    },
    marginB8: {
        marginBottom: 8
    },
    street: {
        fontWeight: 'bold'
    },
    link: {
        textDecorationLine: 'underline',
        color: '#000e18'
    },
    italic: {
        fontStyle: 'italic',
        color: '#4b5862'
    },
    notItalic: {
        fontStyle: 'normal',
        color: '#6a7d8a'
    },
    meta: {
        fontSize: 14,
        color: '#6a7d8a'
    },
    iconStyle: {
        fontSize: 32,
        color: '#97a5af',
    },
    confirmButton: {
        backgroundColor:"#f5fbff",
        width: '100%',
        elevation: 0
    },
    condition: {
        marginTop: 10
    },
    conditionText: {
        color: '#6a7d8a',
        fontSize: 14,
        fontStyle: 'italic',
        marginLeft: 5,
        paddingBottom: 5
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
    saveLocation: {
        position: 'absolute',
        zIndex: 10, 
        top: 0,
        right: 5,
        fontSize: 24,
        color: '#F53240',
        padding: 10
    },
    savedIcon: {
        fontSize: 24
    },
    savedLink: {
        backgroundColor:'#f5fbff',
        borderWidth: 1,
        borderColor: '#4b5862',
        borderRadius: 5,
        elevation: 0
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
    closeFavoriteLocationModal: PropTypes.func,
    removeFavoriteLocation: PropTypes.func,
    addFavoriteLocation: PropTypes.func,
}

const mapStateToProps = ({ application, error, location, locations, operators, machines, query, user }) => ({ application, error, location, locations, operators, machines, query, user})
const mapDispatchToProps = (dispatch) => ({
    fetchLocation: url => dispatch(fetchLocation(url)),
    confirmLocationIsUpToDate: (body, id, username) => dispatch(confirmLocationIsUpToDate(body, id, username)),
    closeConfirmModal: () => dispatch(closeConfirmModal()),
    setCurrentMachine: id => dispatch(setCurrentMachine(id)),
    clearError: () => dispatch(clearError()),
    removeFavoriteLocation: (id) => dispatch(removeFavoriteLocation(id)),
    addFavoriteLocation: (id) => dispatch(addFavoriteLocation(id)),
    closeFavoriteLocationModal: () => dispatch(closeFavoriteLocationModal()),
})
export default connect(mapStateToProps, mapDispatchToProps)(LocationDetails)
