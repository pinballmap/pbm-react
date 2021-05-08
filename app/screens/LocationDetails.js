import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Image,
    Linking,
    Modal,
    Platform,
    Share,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native'
import MapView from 'react-native-maps'
import openMap from 'react-native-open-maps'
import {
    Avatar,
    Button,
    ListItem,
    Icon,
} from 'react-native-elements'
import { ThemeContext } from '../theme-context'
import { FontAwesome } from '@expo/vector-icons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import {
    ActivityIndicator,
    ConfirmationModal,
    HeaderBackButton,
    PbmButton,
    Screen,
    Text,
} from '../components'
import {
    addFavoriteLocation,
    clearError,
    closeConfirmModal,
    closeFavoriteLocationModal,
    confirmLocationIsUpToDate,
    fetchLocation,
    removeFavoriteLocation,
    setCurrentMachine,
    updateCurrCoordinates,
} from '../actions'
import androidCustomDark from '../utils/androidCustomDark'

import { alphaSortNameObj, getDistance } from '../utils/utilityFunctions'

const moment = require('moment')

class LocationDetails extends Component {
    state = {
        id: this.props.navigation.state.params['id'],
        showLocationToolsModal: false
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton navigation={navigation} />,
            gesturesEnabled: true,
            headerTransparent: true,
        }
    }

    getTitle = (machine, s) => (
        <Text>
            <Text style={s.machineName}>{machine.name}</Text>
            {machine.year ? <Text style={[s.machineMeta,s.italic]}>{` (${machine.manufacturer && machine.manufacturer + ", "}${machine.year})`}</Text> : null}
        </Text>
    )

    handleConfirmPress = (id, loggedIn) => {
        this.setShowLocationToolsModal(false)
        if (loggedIn) {
            const {email, username, authentication_token} = this.props.user
            const body = {
                user_email: email,
                user_token: authentication_token,
            }
            this.props.confirmLocationIsUpToDate(body, id, username)
        } else {
            this.props.navigation.navigate('Login')
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        if (this.props.location.addingMachineToLocation && !props.location.addingMachineToLocation)
            this.props.fetchLocation(this.state.id)

        // If the location name isn't known before arriving on this screen, this will populate the header with the location name once it comes back
        if (!this.props.navigation.getParam('locationName') && !this.props.location.location.name && props.location.location.name || (this.props.location.location.name !== props.location.location.name))
            this.props.navigation.setParams({ locationName: props.location.location.name })

        if (this.props.navigation.state.params['updateMap'] && this.props.location.isFetchingLocation && !props.location.isFetchingLocation) {
            this.props.updateCurrCoordinates(props.location.location.lat, props.location.location.lon)
        }
    }

    setShowLocationToolsModal(visible) {
        this.setState({showLocationToolsModal: visible})
    }

    componentDidMount() {
        this.props.fetchLocation(this.state.id)
    }

    render() {
        if (this.props.location.isFetchingLocation || !this.props.location.location.id || this.props.location.addingMachineToLocation) {
            return (
                <ActivityIndicator />
            )
        }

        const location = this.props.location.location
        const { errorText } = this.props.error
        const errorModalVisible = errorText && errorText.length > 0 ? true : false
        const { loggedIn, faveLocations = [], favoriteModalVisible, favoriteModalText, addingFavoriteLocation, removingFavoriteLocation, lat: userLat, lon: userLon, locationTrackingServicesEnabled } = this.props.user
        const isUserFave = faveLocations.some(fave => fave.location_id === location.id)
        const sortedMachines = alphaSortNameObj(location.location_machine_xrefs.map(machine => {
            const machineDetails = this.props.machines.machines.find(m => m.id === machine.machine_id)
            return {...machineDetails, ...machine}
        }))

        return (
            <ThemeContext.Consumer>
                {({ theme }) => {
                    const s = getStyles(theme)
                    return (
                        <View style={{ flex: 1 }}>
                            <Screen>
                                <ConfirmationModal visible={this.state.showLocationToolsModal}>
                                    <View style={s.header}>
                                        <Text style={s.filterTitle}>Location Editing Tools</Text>
                                        <MaterialCommunityIcons
                                            name='close-circle'
                                            size={45}
                                            onPress={() => this.setShowLocationToolsModal(false)}
                                            style={s.xButton}
                                        />
                                    </View>
                                    <View>
                                        <ListItem
                                            containerStyle={s.containerBg}
                                            onPress={() => loggedIn ? this.props.navigation.navigate('FindMachine') && this.setShowLocationToolsModal(false) : this.props.navigation.navigate('Login') && this.setShowLocationToolsModal(false) }>
                                            <Avatar>
                                                {<MaterialCommunityIcons name='plus-outline' style={s.buttonIcon} />}
                                            </Avatar>
                                            <ListItem.Content>
                                                <ListItem.Title style={s.titleStyle}>
                                                    <Text>{'Add Machine'}</Text>
                                                </ListItem.Title>
                                            </ListItem.Content>
                                        </ListItem>
                                        <ListItem
                                            containerStyle={s.containerBg}
                                            onPress={() => this.handleConfirmPress(location.id, loggedIn) }>
                                            <Avatar>
                                                {<MaterialCommunityIcons name='check-outline' style={s.buttonIcon} />}
                                            </Avatar>
                                            <ListItem.Content>
                                                <ListItem.Title style={s.titleStyle}>
                                                    <Text>{'Confirm Line-Up'}</Text>
                                                </ListItem.Title>
                                            </ListItem.Content>
                                        </ListItem>
                                        <ListItem
                                            containerStyle={s.containerBg}
                                            onPress={() => loggedIn ? this.props.navigation.navigate('EditLocationDetails', {name: this.props.navigation.getParam('locationName')}) && this.setShowLocationToolsModal(false) : this.props.navigation.navigate('Login') && this.setShowLocationToolsModal(false) }>
                                            <Avatar>
                                                {<MaterialCommunityIcons name='pencil-outline' style={s.buttonIcon} />}
                                            </Avatar>
                                            <ListItem.Content>
                                                <ListItem.Title style={s.titleStyle}>
                                                    <Text>{'Edit Location Details'}</Text>
                                                </ListItem.Title>
                                            </ListItem.Content>
                                        </ListItem>
                                        <ListItem
                                            containerStyle={s.containerBg}
                                            onPress={async () => {
                                                await Share.share({
                                                    message: `Checkout this pinball map location! https://pinballmap.com/map/?by_location_id=${location.id}`,
                                                }) && this.setShowLocationToolsModal(false)
                                            }}>
                                            <Avatar>
                                                {<MaterialCommunityIcons name='ios-share-outline' style={s.buttonIcon} />}
                                            </Avatar>
                                            <ListItem.Content>
                                                <ListItem.Title style={s.titleStyle}>
                                                    <Text>{'Share Location'}</Text>
                                                </ListItem.Title>
                                            </ListItem.Content>
                                        </ListItem>
                                        <ListItem
                                            containerStyle={s.containerBg}
                                            onPress={() => {
                                                openMap({end: `${location.name} ${location.city} ${location.state} ${location.zip}`})
                                                this.setShowLocationToolsModal(false)
                                            }}>
                                            <Avatar>
                                                {<MaterialCommunityIcons name='directions' style={s.buttonIcon} />}
                                            </Avatar>
                                            <ListItem.Content>
                                                <ListItem.Title style={s.titleStyle}>
                                                    <Text>{'Directions'}</Text>
                                                </ListItem.Title>
                                            </ListItem.Content>
                                        </ListItem>
                                    </View>
                                </ConfirmationModal>
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
                                                <PbmButton
                                                    title={'View Saved Locations'}
                                                    onPress={() => {
                                                        this.props.closeFavoriteLocationModal()
                                                        this.props.navigation.navigate('Saved')
                                                    }}
                                                    buttonStyle={s.savedLink}
                                                    titleStyle={s.buttonTitleStyle}
                                                    iconLeft
                                                    icon={<FontAwesome name="heart-o" style={s.savedIcon} />}
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
                                        showsMyLocationButton={false}
                                        style={s.mapHeight}
                                        provider = { MapView.PROVIDER_GOOGLE }
                                        customMapStyle={theme.theme === 'dark' ? androidCustomDark : []}
                                    >
                                        <MapView.Marker
                                            coordinate={{
                                                latitude: Number(location.lat),
                                                longitude: Number(location.lon),
                                                latitudeDelta: 0.03,
                                                longitudeDelta: 0.03,
                                            }}
                                        >
                                            <View style={s.markerDot}></View>
                                        </MapView.Marker>
                                    </MapView>
                                    <View style={s.locationNameContainer}>
                                        <Text style={s.locationName}>{location.name}</Text>
                                    </View>
                                    <View style={s.locationContainer}>
                                        {location.date_last_updated && <Text style={s.lastUpdated}>Updated: {moment(location.date_last_updated, 'YYYY-MM-DD').format('MMM DD, YYYY')}{location.last_updated_by_username && ` by` }<Text style={s.textStyle}>{` ${location.last_updated_by_username}`}</Text></Text>}
                                        {location.date_last_updated && moment(location.date_last_updated).unix() < moment().subtract(2, 'years').unix() && <View style={s.staleView}><Text style={s.staleText}>This location has not been updated in over 2 years. The information may be out of date.</Text></View>}
                                        <View style={s.locationMetaContainer}>
                                            <View style={location.location_type_id ? s.locationMetaInner : s.locationMetaInner2}>
                                                <Text style={[s.font18,s.marginRight]}>{location.street}</Text>
                                                <Text style={[s.city,s.font18,s.marginB8,s.marginRight]}>{location.city}, {location.state} {location.zip}</Text>
                                                {locationTrackingServicesEnabled && !location.location_type_id ? <Text style={[s.meta,s.marginB8]}>{getDistance(userLat, userLon, location.lat, location.lon).toFixed(2)} mi</Text> : null}
                                                {location.phone ? <Text style={[s.link,s.marginB8]} onPress={() => Linking.openURL(`tel:${location.phone}`)}>{location.phone}</Text> : null}

                                                {location.website ? <Text style={[s.link,s.marginB8]} onPress={() => Linking.openURL(location.website)}>Website</Text> : null}

                                                {location.operator_id ?
                                                    <Text style={[s.metaDescription,s.italic,s.marginB8]}>Operated by:
                                                        <Text style={s.notItalic}> {` ${this.props.operators.operators.find(operator => operator.id === location.operator_id).name}`}</Text>
                                                    </Text> : null
                                                }
                                            </View>
                                            {location.location_type_id ?
                                                <View style={s.locationMetaIcon}>
                                                    <View>
                                                        <Icon
                                                            name={this.props.locations.locationTypes.find(type => type.id === location.location_type_id).icon}
                                                            type={this.props.locations.locationTypes.find(type => type.id === location.location_type_id).library}
                                                            color={theme.orange7}
                                                            size={50}
                                                        />
                                                        <Text style={{textAlign:'center',color:theme.orange8}}>{this.props.locations.locationTypes.find(type => type.id === location.location_type_id).name}</Text>
                                                    </View>
                                                    {locationTrackingServicesEnabled && <Text style={{fontSize:18}}>{getDistance(userLat, userLon, location.lat, location.lon).toFixed(2)} mi</Text>}
                                                </View> : null
                                            }
                                        </View>
                                        <View style={{width:'100%',paddingBottom:5}}>
                                            {location.description ?
                                                <Text style={[s.metaDescription,s.italic]}>Location Notes:
                                                    <Text style={[s.notItalic,s.metaDescription]}> {location.description}</Text>
                                                </Text> : null
                                            }
                                        </View>
                                    </View>
                                    <View style={s.backgroundColor}>
                                        {sortedMachines.map(machine => (
                                            <TouchableOpacity
                                                key={machine.id}
                                                onPress={() => {
                                                    this.props.navigation.navigate('MachineDetails', {machineName: machine.name, locationName: location.name})
                                                    this.props.setCurrentMachine(machine.id)
                                                }}>
                                                <View style={s.listContainerStyle}>
                                                    <View style={machine.condition ? s.machineNameContainer : s.machineNameContainer2} >
                                                        {this.getTitle(machine, s)}
                                                    </View>
                                                    {machine.condition_date ?
                                                        <View style={s.condition}>
                                                            <View>
                                                                {machine.condition_date ? <Text style={s.commentUpdated}>{`Updated: ${moment(machine.condition_date, 'YYYY-MM-DD').format('MMM DD, YYYY')}`}</Text> : null}
                                                            </View>
                                                            <View>
                                                                {machine.condition ? <Text style={s.conditionText}>{`"${machine.condition.length < 100 ? machine.condition : `${machine.condition.substr(0, 100)}...`}"${machine.last_updated_by_username && ` - ${machine.last_updated_by_username}`}`}</Text> : null}
                                                            </View>
                                                        </View> : null
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </Screen>
                            <View style={s.locationIcon}>
                                <Icon
                                    reverse
                                    name='tools'
                                    type='entypo'
                                    color={theme.indigo4}
                                    reverseColor='#ffffff'
                                    size={28}
                                    containerStyle={[s.iconContainerStyle,{overflow: 'visible'}]}
                                    onPress={() => this.setShowLocationToolsModal(true)}
                                />
                            </View>
                        </View>
                    )
                }}
            </ThemeContext.Consumer>
        )
    }
}

const getStyles = theme => StyleSheet.create({
    mapHeight: {
        zIndex: -1,
        height: 160,
    },
    backgroundColor: {
        backgroundColor: theme.neutral
    },
    locationContainer: {
        flex: 3,
        borderRadius: 25,
        marginBottom: 5,
        marginRight: 30,
        marginLeft: 30,
        borderWidth: 0,
    },
    locationNameContainer: {
        backgroundColor: theme.neutral2,
        borderRadius: 25,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 30,
        marginLeft: 30,
        borderWidth: 0,
        paddingTop: 5,
        paddingBottom: 5,
    },
    locationName: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24,
        color: theme.orange8
    },
    textStyle: {
        color: theme.orange7,
    },
    containerBg: {
        backgroundColor: theme.neutral
    },
    titleStyle: {
        color: theme.text
    },
    listContainerStyle: {
        borderRadius: 25,
        marginBottom: 25,
        marginRight: 20,
        marginLeft: 20,
        borderWidth: 0,
        backgroundColor: theme.white,
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 5,
    },
    machineName: {
        color: theme.text,
        fontWeight: 'bold',
        fontSize: 20,
    },
    machineNameContainer: {
        backgroundColor: theme.blue1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingVertical: 10,
        paddingLeft: 20,
        paddingRight: 15,
    },
    machineNameContainer2: {
        backgroundColor: theme.blue1,
        borderRadius: 25,
        paddingVertical: 10,
        paddingLeft: 20,
        paddingRight: 15,
    },
    machineMeta: {
        fontSize: 16
    },
    locationMetaContainer: {
        paddingTop: 5,
        paddingBottom: 0,
        marginTop: 5,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    locationMetaInner: {
        width: '65%'
    },
    locationMetaInner2: {
        width: '100%'
    },
    locationMetaIcon: {
        backgroundColor: theme.indigo2,
        borderRadius: 10,
        padding: 5,
        width: '35%',
        alignItems: 'center',
    },
    locationIcon: {
        position: 'absolute',
        bottom: 25,
        right: 10,
        zIndex: 100
    },
    font18: {
        fontSize: 18
    },
    marginB8: {
        marginBottom: 8
    },
    marginRight: {
        marginRight: 10
    },
    street: {
        fontWeight: 'bold'
    },
    link: {
        textDecorationLine: 'underline',
        color: theme.text,
        fontSize: 16
    },
    italic: {
        fontStyle: 'italic',
        color: theme.orange7
    },
    notItalic: {
        fontStyle: 'normal',
        color: theme.orange7
    },
    meta: {
        fontSize: 16,
        color: theme.orange7
    },
    metaDescription: {
        fontSize: 13
    },
    iconStyle: {
        fontSize: 32,
        color: '#97a5af',
    },
    condition: {
        marginTop: 5,
        flexDirection: 'column',
        marginLeft: 10
    },
    conditionText: {
        color: theme.indigo4,
        fontSize: 12,
        fontStyle: 'italic',
        marginLeft: 10,
        marginBottom: 10,
        paddingTop: 10,
    },
    staleView: {
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: theme.red3,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    staleText: {
        color: theme.red2,
        fontStyle: 'italic',
    },
    lastUpdated: {
        textAlign: 'center',
        color: theme.orange7
    },
    commentUpdated: {
        color: theme.orange7,
        marginLeft: 10,
    },
    buttonIcon: {
        color: theme.text,
        fontSize: 32,
    },
    confirmText: {
        textAlign: 'center',
        fontSize: 18,
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
        top: 120,
        right: 5,
        fontSize: 28,
        color: theme.red2,
        padding: 10
    },
    savedIcon: {
        color: theme.orange8,
        fontSize: 24,
        marginRight: 5
    },
    savedLink: {
        borderWidth: 2,
        width: '100%',
        borderColor: theme.blue2,
        borderRadius: 25,
        backgroundColor: theme.white
    },
    buttonTitleStyle: {
        fontSize: 16,
        color: theme.text,
        textTransform: 'capitalize',
        fontWeight: Platform.OS === 'ios' ? "500" : "400"
    },
    margin15: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 0,
        marginBottom: 15
    },
    borderBottom: {
        borderBottomColor: theme.orange3,
        borderBottomWidth: 1,
    },
    markerDot: {
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        borderWidth: 3,
        borderColor: '#d2e5fa',
        backgroundColor: '#78b6fb',
        elevation: 1
    },
    header: {
        backgroundColor: theme.blue1,
        marginTop: -15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: 40,
        paddingVertical: 10,
    },
    filterTitle: {
        color: theme.orange8,
        textAlign: "center",
        fontSize: 16,
        fontWeight: 'bold'
    },
    xButton: {
        position: 'absolute',
        right: -15,
        top: -15,
        color: theme.red2,
    },
    iconContainerStyle: {
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 5,
        overflow: 'visible'
    }
})

LocationDetails.propTypes = {
    confirmLocationIsUpToDate: PropTypes.func,
    fetchLocation: PropTypes.func,
    location: PropTypes.object,
    locations: PropTypes.object,
    operators: PropTypes.object,
    machines: PropTypes.object,
    user: PropTypes.object,
    closeConfirmModal: PropTypes.func,
    setCurrentMachine: PropTypes.func,
    navigation: PropTypes.object,
    clearError: PropTypes.func,
    error: PropTypes.object,
    closeFavoriteLocationModal: PropTypes.func,
    removeFavoriteLocation: PropTypes.func,
    addFavoriteLocation: PropTypes.func,
    updateCurrCoordinates: PropTypes.func,
}

const mapStateToProps = ({ application, error, location, locations, operators, machines, user }) => ({ application, error, location, locations, operators, machines, user})
const mapDispatchToProps = (dispatch) => ({
    fetchLocation: url => dispatch(fetchLocation(url)),
    confirmLocationIsUpToDate: (body, id, username) => dispatch(confirmLocationIsUpToDate(body, id, username)),
    closeConfirmModal: () => dispatch(closeConfirmModal()),
    setCurrentMachine: id => dispatch(setCurrentMachine(id)),
    clearError: () => dispatch(clearError()),
    removeFavoriteLocation: (id) => dispatch(removeFavoriteLocation(id)),
    addFavoriteLocation: (id) => dispatch(addFavoriteLocation(id)),
    closeFavoriteLocationModal: () => dispatch(closeFavoriteLocationModal()),
    updateCurrCoordinates: (lat, lon) => dispatch(updateCurrCoordinates(lat, lon)),
})
export default connect(mapStateToProps, mapDispatchToProps)(LocationDetails)
