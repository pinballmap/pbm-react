import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Dimensions,
    Image,
    Linking,
    Modal,
    Platform,
    Pressable,
    Share,
    StyleSheet,
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
import { MaterialIcons } from '@expo/vector-icons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import {
    ActivityIndicator,
    ConfirmationModal,
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
    updateCoordinatesAndGetLocations,
} from '../actions'
import androidCustomDark from '../utils/androidCustomDark'
import { HeaderBackButton } from 'react-navigation-stack'
import {
    alphaSortNameObj,
    getDistanceWithUnit,
} from '../utils/utilityFunctions'

let deviceWidth = Dimensions.get('window').width

const moment = require('moment')

class LocationDetails extends Component {
    state = {
        id: this.props.navigation.state.params['id'],
        showLocationToolsModal: false
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: () => <HeaderBackButton
                tintColor={'#6eb4eb'}
                onPress={() => {
                    navigation.goBack(null)
                }}
                labelVisible={false}
            />,
            title: null,
            gestureEnabled: true,
            headerTransparent: true,
        }
    }

    getTitle = (machine, s) => (
        <Text>
            <Text style={s.machineName}>{machine.name}</Text>
            {machine.year ? <Text style={[s.fontSize18,s.text2]}>{` (${machine.manufacturer && machine.manufacturer + ", "}${machine.year})`}</Text> : null}
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
        if (this.props.location.addingMachineToLocation && !props.location.addingMachineToLocation) {
            this.props.fetchLocation(this.state.id)
        }
        // If the location name isn't known before arriving on this screen, this will populate the header with the location name once it comes back
        if (!this.props.navigation.getParam('locationName') && !this.props.location.location.name && props.location.location.name || (this.props.location.location.name !== props.location.location.name))
            this.props.navigation.setParams({ locationName: props.location.location.name })

        if (this.props.navigation.state.params['updateMap'] && this.props.location.isFetchingLocation && !props.location.isFetchingLocation) {
            this.props.updateCoordinatesAndGetLocations(props.location.location.lat, props.location.location.lon)
        }

        if (props.navigation.state.params['id'] !== this.props.navigation.state.params['id']) {
            this.setState({ id: props.navigation.state.params['id'] }, () => {
                this.props.fetchLocation(this.state.id)
            })
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
        const { loggedIn, faveLocations = [], favoriteModalVisible, favoriteModalText, addingFavoriteLocation, removingFavoriteLocation, lat: userLat, lon: userLon, locationTrackingServicesEnabled, unitPreference } = this.props.user
        const isUserFave = faveLocations.some(fave => fave.location_id === location.id)
        const sortedMachines = alphaSortNameObj(location.location_machine_xrefs.map(machine => {
            const machineDetails = this.props.machines.machines.find(m => m.id === machine.machine_id)
            return {...machineDetails, ...machine}
        }))
        const { icon: locationIcon, library: iconLibrary, name: locationTypeName } = this.props.locations.locationTypes.find(type => type.id === location.location_type_id) || {}

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
                                            containerStyle={s.backgroundColor}
                                            onPress={() => loggedIn ? this.props.navigation.navigate('FindMachine') && this.setShowLocationToolsModal(false) : this.props.navigation.navigate('Login') && this.setShowLocationToolsModal(false) }>
                                            <Avatar>
                                                {<MaterialCommunityIcons name='plus-outline' style={s.buttonIcon} />}
                                            </Avatar>
                                            <ListItem.Content>
                                                <ListItem.Title style={s.text3}>
                                                    Add Machine
                                                </ListItem.Title>
                                            </ListItem.Content>
                                        </ListItem>
                                        <ListItem
                                            containerStyle={s.backgroundColor}
                                            onPress={() => this.handleConfirmPress(location.id, loggedIn) }>
                                            <Avatar>
                                                {<MaterialCommunityIcons name='check-outline' style={s.buttonIcon} />}
                                            </Avatar>
                                            <ListItem.Content>
                                                <ListItem.Title style={s.text3}>
                                                    Confirm Line-Up
                                                </ListItem.Title>
                                            </ListItem.Content>
                                        </ListItem>
                                        <ListItem
                                            containerStyle={s.backgroundColor}
                                            onPress={() => loggedIn ? this.props.navigation.navigate('EditLocationDetails', {name: this.props.navigation.getParam('locationName')}) && this.setShowLocationToolsModal(false) : this.props.navigation.navigate('Login') && this.setShowLocationToolsModal(false) }>
                                            <Avatar>
                                                {<MaterialCommunityIcons name='pencil-outline' style={s.buttonIcon} />}
                                            </Avatar>
                                            <ListItem.Content>
                                                <ListItem.Title style={s.text3}>
                                                    Edit Location Details
                                                </ListItem.Title>
                                            </ListItem.Content>
                                        </ListItem>
                                        <ListItem
                                            containerStyle={s.backgroundColor}
                                            onPress={async () => {
                                                await Share.share({
                                                    message: `https://pinballmap.com/map/?by_location_id=${location.id}`,
                                                }) && this.setShowLocationToolsModal(false)
                                            }}>
                                            <Avatar>
                                                {<MaterialIcons name='ios-share' style={s.buttonIcon} />}
                                            </Avatar>
                                            <ListItem.Content>
                                                <ListItem.Title style={s.text3}>
                                                    Share Location
                                                </ListItem.Title>
                                            </ListItem.Content>
                                        </ListItem>
                                        <ListItem
                                            containerStyle={s.backgroundColor}
                                            onPress={() => {
                                                openMap({end: `${location.name} ${location.city} ${location.state} ${location.zip}`})
                                                this.setShowLocationToolsModal(false)
                                            }}>
                                            <Avatar>
                                                {<MaterialCommunityIcons name='directions' style={s.buttonIcon} />}
                                            </Avatar>
                                            <ListItem.Content>
                                                <ListItem.Title style={s.text3}>
                                                    Directions
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
                                                    containerStyle={s.buttonContainerStyle}
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
                                                    containerStyle={s.buttonContainerStyle}
                                                    iconLeft
                                                    icon={<MaterialCommunityIcons name="heart" style={s.savedIcon} />}
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
                                    <Pressable
                                        style={({ pressed }) => [{},s.plusButton,s.quickButton,pressed ? s.quickButtonPressed : s.quickButtonNotPressed]}
                                        onPress={() => loggedIn ? this.props.navigation.navigate('FindMachine') : this.props.navigation.navigate('Login') }
                                    >
                                        <MaterialCommunityIcons
                                            name={'plus'}
                                            color={theme.text2}
                                            size={28}
                                            style={{height:28,width:28,justifyContent:'center',alignSelf:'center'}}
                                        />
                                    </Pressable>
                                    <Pressable
                                        style={({ pressed }) => [{},s.saveButton,s.quickButton,pressed ? s.quickButtonPressed : s.quickButtonNotPressed]}
                                        onPress={() => !loggedIn ? this.props.navigation.navigate('Login') : isUserFave ? this.props.removeFavoriteLocation(location.id) : this.props.addFavoriteLocation(location.id)}
                                    >
                                        {loggedIn && isUserFave ?
                                            <MaterialCommunityIcons
                                                name={'heart'}
                                                color={theme.red2}
                                                size={26}
                                                style={{height:26,width:26,justifyContent:'center',alignSelf:'center'}}
                                            /> :
                                            <MaterialCommunityIcons
                                                name={'heart-outline'}
                                                color={theme.red2}
                                                size={26}
                                                style={{height:26,width:26,justifyContent:'center',alignSelf:'center'}}
                                            />
                                        }
                                    </Pressable>
                                    <Pressable
                                        style={({ pressed }) => [{},s.shareButton,s.quickButton,pressed ? s.quickButtonPressed : s.quickButtonNotPressed]}
                                        onPress={async () => {
                                            await Share.share({
                                                message: `https://pinballmap.com/map/?by_location_id=${location.id}`,
                                            })
                                        }}
                                    >
                                        <MaterialIcons
                                            name={'ios-share'}
                                            color={theme.text2}
                                            size={24}
                                            style={{height:24,width:24,justifyContent:'center',alignSelf:'center'}}
                                        />
                                    </Pressable>

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
                                    <View>
                                        <Text style={s.locationName}>{location.name}</Text>
                                    </View>
                                    <View style={s.locationContainer}>
                                        <View style={s.locationMetaContainer}>
                                            <View style={location.location_type_id ? s.locationMetaInner : s.locationMetaInner2}>
                                                <Text style={[s.text2,s.fontSize16,s.marginRight,s.opacity09]}>{location.street}</Text>

                                                <Text style={[s.text2,s.fontSize16,s.marginB8,s.marginRight,s.opacity09]}>{location.city}, {location.state} {location.zip}</Text>

                                                {locationTrackingServicesEnabled && !location.location_type_id ? <View style={{flexDirection: "row"}}><MaterialCommunityIcons name='compass-outline' style={s.metaIcon} /><Text style={[s.fontSize13,s.text3,s.marginB8]}>{getDistanceWithUnit(userLat, userLon, location.lat, location.lon, unitPreference)}</Text></View> : null}

                                                {location.phone ? <View style={{flexDirection: "row"}}><MaterialIcons name='local-phone' style={s.metaIcon} /><Text style={[s.link,s.marginB8]} onPress={() => Linking.openURL(`tel:${location.phone}`)}>{location.phone}</Text></View> : null}

                                                {location.website ? <View style={{flexDirection: "row"}}><MaterialCommunityIcons name='web' style={s.metaIcon} /><Text style={[s.link,s.marginB8]} onPress={() => Linking.openURL(location.website)}>Website</Text></View> : null}

                                                {location.operator_id ?
                                                    <View style={(location.phone && location.website && location.location_type_id) ? s.wide : s.narrow}><MaterialCommunityIcons name='wrench-outline' style={s.metaIcon} /><Text style={[s.text2,s.fontSize13,s.marginB8,s.marginRight]}>Operated by:
                                                        <Text style={s.text3}> {`${this.props.operators.operators.find(operator => operator.id === location.operator_id).name}`}</Text>
                                                    </Text></View> : null
                                                }

                                                {location.date_last_updated ?
                                                    <View style={(location.phone && location.website && location.location_type_id) || (location.phone && location.operator_id && location.location_type_id) || (location.website && location.operator_id && location.location_type_id) ? s.wide : s.narrow}><MaterialCommunityIcons name='clock-time-four-outline' style={s.metaIcon} /><Text style={[s.text2,s.fontSize13,s.marginB8,s.marginRight]}>Last updated: <Text style={s.text3}>{moment(location.date_last_updated, 'YYYY-MM-DD').format('MMM DD, YYYY')}{location.last_updated_by_username && ` by` }{` ${location.last_updated_by_username}`}</Text></Text></View>
                                                    : null
                                                }

                                            </View>

                                            {location.location_type_id ?
                                                <View style={s.locationTypeContainer}>
                                                    {locationTrackingServicesEnabled && <View style={{flexDirection: "row"}}><MaterialCommunityIcons name='compass-outline' style={s.distanceIcon} /><Text style={[s.fontSize14,s.text2,s.opacity09]}>{getDistanceWithUnit(userLat, userLon, location.lat, location.lon, unitPreference)}</Text></View>}
                                                    <View>
                                                        <Icon
                                                            name={locationIcon}
                                                            type={iconLibrary}
                                                            color={theme.orange3}
                                                            size={46}
                                                        />
                                                        <Text style={[{textAlign: 'center'},s.fontSize14,s.text2,s.opacity09]}>{locationTypeName}</Text>
                                                    </View>
                                                </View> : null
                                            }
                                        </View>
                                        <View style={{width:'100%',paddingRight:10,paddingBottom:5}}>
                                            {location.description ?
                                                <View style={{flexDirection: "row"}}><MaterialCommunityIcons name='notebook-outline' style={s.metaIcon} />
                                                    <Text style={[s.text3,s.fontSize13]}>{location.description}</Text>
                                                </View> : null
                                            }
                                        </View>
                                        {location.date_last_updated && moment(location.date_last_updated).unix() < moment().subtract(2, 'years').unix() && <View style={s.staleView}><Text style={s.staleText}>This location has not been updated in over 2 years. The information may be out of date.</Text></View>}
                                    </View>
                                    <View style={s.backgroundColor}>
                                        {sortedMachines.map(machine => (
                                            <Pressable
                                                key={machine.id}
                                                onPress={() => {
                                                    this.props.navigation.navigate('MachineDetails', {machineName: machine.name, locationName: location.name})
                                                    this.props.setCurrentMachine(machine.id)
                                                }}
                                            >
                                                {({ pressed }) => (
                                                    <View style={[s.machineListContainer,pressed ? s.pressed : s.notPressed]}>
                                                        {this.getTitle(machine, s)}
                                                        {machine.condition_date ?
                                                            <View style={s.condition}>
                                                                <View style={{flexDirection: "row"}}><MaterialCommunityIcons name='clock-time-four-outline' style={s.metaIcon} />
                                                                    {machine.condition_date ? <Text style={[s.fontSize13,s.text3]}>{`Updated: ${moment(machine.condition_date, 'YYYY-MM-DD').format('MMM DD, YYYY')}`}</Text> : null}
                                                                </View>
                                                                <View style={{flexDirection: "row",paddingTop: 10}}><MaterialCommunityIcons name='comment-quote-outline' style={s.metaIcon} />
                                                                    {machine.condition ? <Text style={[s.text3,s.opacity06,s.fontSize12]}>{`"${machine.condition.length < 100 ? machine.condition : `${machine.condition.substr(0, 100)}...`}"${machine.last_updated_by_username && ` - ${machine.last_updated_by_username}`}`}</Text> : null}
                                                                </View>
                                                            </View> : null
                                                        }
                                                    </View>
                                                )}
                                            </Pressable>
                                        ))}
                                    </View>
                                </View>
                            </Screen>
                            <Pressable
                                style={({ pressed }) => [{},s.toolsIconButton,pressed ? s.toolsIconPressed : s.toolsIconNotPressed]}
                                onPress={() => {
                                    this.setShowLocationToolsModal(true)
                                }}
                            >
                                <MaterialCommunityIcons
                                    name={'tools'}
                                    color={theme.text3}
                                    size={28}
                                    style={{justifyContent:'center',alignSelf:'center'}}
                                />
                            </Pressable>
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
        height: deviceWidth < 325 ? 120 : 160,
    },
    backgroundColor: {
        backgroundColor: theme.base1
    },
    locationContainer: {
        flex: 3,
        marginBottom: 10,
        marginHorizontal: deviceWidth < 325 ? 20 : 30,
    },
    locationName: {
        textAlign: 'center',
        fontFamily: 'boldFont',
        fontSize: 20,
        paddingHorizontal: 8,
        color: theme.text,
        marginTop: 8,
        marginBottom: 4,
        opacity: 0.9
    },
    machineListContainer: {
        borderRadius: 25,
        marginBottom: 20,
        marginRight: 20,
        marginLeft: 20,
        backgroundColor: theme.white,
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 6,
        paddingVertical: 10,
        paddingLeft: 20,
        paddingRight: 15,
    },
    pressed: {
        borderColor: theme.blue1,
        borderWidth: 2,
        shadowColor: 'transparent',
        opacity: 0.8,
        elevation: 0,
    },
    notPressed: {
        borderColor: theme.white,
        borderWidth: 2,
        shadowColor: theme.shadow,
        opacity: 1.0,
        elevation: 6,
    },
    machineName: {
        color: theme.text,
        fontFamily: 'boldFont',
        fontSize: 20,
    },
    locationMetaContainer: {
        paddingTop: 5,
        paddingBottom: 0,
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
    locationTypeContainer: {
        backgroundColor: theme.base2,
        borderWidth: 2,
        borderColor: theme.base4,
        borderRadius: 10,
        padding: 5,
        width: '35%',
        alignItems: 'center',
        marginBottom: 5
    },
    fontSize12: {
        fontSize: 12
    },
    fontSize14: {
        fontSize: 14
    },
    fontSize13: {
        fontSize: 13
    },
    fontSize16: {
        fontSize: 16
    },
    fontSize18: {
        fontSize: 18,
    },
    marginB8: {
        marginTop: Platform.OS === 'android' ? 2 : 0,
        marginBottom: 8
    },
    marginRight: {
        marginRight: 10
    },
    link: {
        textDecorationLine: 'underline',
        fontSize: 14,
        color: theme.blue3
    },
    text2: {
        color: theme.text2
    },
    text3: {
        color: theme.text3
    },
    italic: {
        fontFamily: 'regularItalicFont'
    },
    opacity09: {
        opacity: 0.9
    },
    opacity06: {
        opacity: 0.6
    },
    iconStyle: {
        fontSize: 32,
        color: '#97a5af',
    },
    condition: {
        flexDirection: 'column',
        marginRight: 10,
        marginTop: 10,
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
    },
    buttonIcon: {
        color: theme.text3,
        opacity: 0.8,
        fontSize: 32,
    },
    confirmText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'boldFont',
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
    quickButton: {
        borderWidth: 1,
        borderColor: theme.borderWhite,
        position: 'absolute',
        padding: 10,
        zIndex: 10,
        borderRadius: 18,
        height: 36,
        width: 36,
        alignSelf: 'center',
        justifyContent:'center',
        top: deviceWidth < 325 ? 80 : 120,
        shadowColor: theme.darkShadow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 6,
    },
    saveButton: {
        right: 10,
    },
    plusButton: {
        right: 110,
    },
    shareButton: {
        right: 60,
    },
    savedIcon: {
        color: theme.text2,
        fontSize: 24,
        marginRight: 5
    },
    metaIcon: {
        paddingTop: 1,
        fontSize: 16,
        color: theme.indigo4,
        marginRight: 5,
        opacity: 0.6
    },
    distanceIcon: {
        marginTop: -1,
        fontSize: 18,
        color: theme.indigo4,
        marginRight: 3,
        opacity: 0.6
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
        fontFamily: 'boldFont',
    },
    buttonContainerStyle: {
        marginHorizontal: deviceWidth < 325 ? 20 : 40,
        marginVertical: 10
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
        marginTop: -25,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: 40,
        paddingVertical: 10,
    },
    filterTitle: {
        color: theme.text2,
        textAlign: "center",
        fontSize: 16,
        fontFamily: 'boldFont',
    },
    xButton: {
        position: 'absolute',
        right: -15,
        top: -15,
        color: theme.red2,
    },
    toolsIconButton: {
        borderWidth: 1,
        borderColor: theme.borderWhite,
        shadowColor: theme.darkShadow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 6,
        overflow: 'visible',
        position: 'absolute',
        bottom: deviceWidth < 325 ? 20 : 30,
        right: 20,
        zIndex: 100,
        alignSelf: 'center',
        justifyContent:'center',
        borderRadius: 29,
        height: 58,
        width: 58,
    },
    toolsIconPressed: {
        backgroundColor: theme.base2,
    },
    toolsIconNotPressed: {
        backgroundColor: theme.blue1,
    },
    quickButtonPressed: {
        backgroundColor: theme.blue2,
    },
    quickButtonNotPressed: {
        backgroundColor: theme.blue1,
    },
    wide: {
        width: '153%',
        flexDirection: "row"
    },
    narrow: {
        width: '95%',
        flexDirection: "row"
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
    updateCoordinatesAndGetLocations: PropTypes.func,
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
    updateCoordinatesAndGetLocations: (lat, lon) => dispatch(updateCoordinatesAndGetLocations(lat, lon)),
})
export default connect(mapStateToProps, mapDispatchToProps)(LocationDetails)
