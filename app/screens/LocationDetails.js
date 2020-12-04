import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Dimensions,
    Image,
    Linking,
    Modal,
    Share,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native'
import MapView from 'react-native-maps'
import openMap from 'react-native-open-maps'
import {
    Button,
    ButtonGroup,
    ListItem,
    Icon,
} from 'react-native-elements'
import { ThemeContext } from '../theme-context'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
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

let deviceHeight = Dimensions.get('window').height

class LocationDetails extends Component {
    state = {
        id: this.props.navigation.state.params['id'],
        buttonIndex: 0,
    }

    static navigationOptions = ({ navigation, theme }) => {
        return {
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: navigation.getParam('locationName'),
            headerRight: navigation.getParam('loggedIn') && navigation.getParam('buttonIndex') === 1 ?
                <Button
                    onPress={() => navigation.navigate('EditLocationDetails', {name: navigation.getParam('locationName')})}
                    containerStyle={{width:50}}
                    title="Edit"
                    accessibilityLabel="Edit"
                    titleStyle={{color: "#1e9dff", fontSize: 18}}
                    type="clear"
                /> : <View style={{padding:6}}></View>,
            headerStyle: {
                backgroundColor: theme === 'dark' ? '#1d1c1d' : '#f5fbff',
            },
            headerTintColor: theme === 'dark' ? '#fdd4d7' : '#4b5862',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1
            },
            gesturesEnabled: true
        }
    }

    updateIndex = buttonIndex => {
        this.setState({ buttonIndex })
        buttonIndex === 1 ? this.props.navigation.setParams({buttonIndex: 1}) : this.props.navigation.setParams({buttonIndex: 0})
    }

    getTitle = (machine, s) => (
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

        // If the location name isn't known before arriving on this screen, this will populate the header with the location name once it comes back
        if (!this.props.navigation.getParam('locationName') && !this.props.location.location.name && props.location.location.name || (this.props.location.location.name !== props.location.location.name))
            this.props.navigation.setParams({ locationName: props.location.location.name })

        if (this.props.navigation.state.params['updateMap'] && this.props.location.isFetchingLocation && !props.location.isFetchingLocation) {
            this.props.updateCurrCoordinates(props.location.location.lat, props.location.location.lon)
        }
    }

    componentDidMount() {
        this.props.fetchLocation(this.state.id)
        this.props.navigation.setParams({loggedIn: this.props.user.loggedIn, buttonIndex: 0})
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
                        <Screen>
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
                                                type="outline"
                                                title={'View Saved Locations'}
                                                onPress={() => {
                                                    this.props.closeFavoriteLocationModal()
                                                    this.props.navigation.navigate('Saved')
                                                }}
                                                buttonStyle={s.savedLink}
                                                titleStyle={s.buttonTitleStyle}
                                                iconLeft
                                                raised
                                                icon={<FontAwesome name="heart-o" style={s.savedIcon} />}
                                                containerStyle={{marginTop:10,marginBottom:10,marginRight:15,marginLeft:15,overflow:'hidden'}}
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
                                    style={deviceHeight > 800 ? s.mapTall : s.mapShort}
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
                                <View style={s.buttonGroupView}>
                                    <ButtonGroup
                                        onPress={this.updateIndex}
                                        selectedIndex={this.state.buttonIndex}
                                        buttons={['Machines', 'Venue Info']}
                                        containerStyle={s.buttonGroupContainer}
                                        textStyle={s.buttonGroupInactive}
                                        selectedButtonStyle={s.selButtonStyle}
                                        selectedTextStyle={s.selTextStyle}
                                        innerBorderStyle={s.innerBorderStyle}
                                    />
                                    {this.state.buttonIndex === 0 ?
                                        <View style={s.backgroundColor}>
                                            {location.date_last_updated && <Text style={s.lastUpdated}>Updated: {moment(location.date_last_updated, 'YYYY-MM-DD').format('MMM DD, YYYY')}{location.last_updated_by_username && ` by` }<Text style={s.textStyle}>{` ${location.last_updated_by_username}`}</Text></Text>}
                                            <View>
                                                <PbmButton
                                                    onPress={() => loggedIn ? this.props.navigation.navigate('FindMachine') : this.props.navigation.navigate('Login') }
                                                    icon={<MaterialCommunityIcons name='plus-outline' style={s.buttonIcon} />}
                                                    title={'Add Machine'}
                                                    accessibilityLabel="Add Machine"
                                                    containerStyle={s.buttonContainer}
                                                />
                                                <PbmButton
                                                    onPress={() => loggedIn ? this.handleConfirmPress(location.id) : this.props.navigation.navigate('Login') }
                                                    title={'Confirm Line-Up'}
                                                    accessibilityLabel="Confirm Line-Up"
                                                    icon={<MaterialCommunityIcons name='check-outline' style={s.buttonIcon} />}
                                                    containerStyle={s.buttonContainer}
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
                                                        style={s.borderBottom}
                                                    />
                                                    <ListItem
                                                        containerStyle={s.listContainerStyle}>
                                                        <ListItem.Content>
                                                            <ListItem.Title>
                                                                {this.getTitle(machine, s)}
                                                            </ListItem.Title>
                                                            {machine.condition_date || machine.condition ? <ListItem.Subtitle style={s.condition}>
                                                                {
                                                                    <View}>
                                                                        {machine.condition ? <Text style={s.conditionText}>{`"${machine.condition.length < 100 ? machine.condition : `${machine.condition.substr(0, 100)}...`}"${machine.last_updated_by_username && ` - ${machine.last_updated_by_username}`}`}</Text> : null}
                                                                        {machine.condition_date ? <Text style={s.commentUpdated}>{`Updated: ${moment(machine.condition_date, 'YYYY-MM-DD').format('MMM DD, YYYY')}`}</Text> : null}
                                                                    </View>
                                                                } 
                                                            </ListItem.Subtitle> : null}
                                                        </ListItem.Content>
                                                        <Icon>
                                                            {<Ionicons style={s.iconStyle} name="ios-arrow-dropright" />}
                                                        </Icon>
                                                    </ListItem>
                                                </TouchableOpacity>
                                            ))}
                                        </View> :
                                        <View style={s.locationMeta}>
                                            <Text selectable style={[s.street,s.font18,s.marginRight]}>{location.street}</Text>
                                            <Text style={[s.city,s.font18,s.marginB8,s.marginRight]}>{location.city}, {location.state} {location.zip}</Text>
                                            <Icon
                                                raised
                                                reverse
                                                name='directions'
                                                type='material'
                                                color='#1e9dff'
                                                size={20}
                                                containerStyle={{position:'absolute',top:0,right:0}}
                                                onPress={() => {
                                                    openMap({end: `${location.name} ${location.city} ${location.state} ${location.zip}`})
                                                }}
                                            />
                                            <PbmButton
                                                onPress={async () => {
                                                    await Share.share({
                                                        message: `Checkout this pinball map location! https://pinballmap.com/map/?by_location_id=${location.id}`,
                                                    })
                                                }}
                                                icon={<Ionicons name="ios-share" style={s.buttonIcon}/>}
                                                title={'Share Location'}
                                                accessibilityLabel='Share Location'
                                                containerStyle={s.buttonContainer}
                                            />
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
                        </Screen>
                    )
                }}
            </ThemeContext.Consumer>
        )
    }
}

const getStyles = theme => StyleSheet.create({
    mapTall: {
        zIndex: -1,
        height: 140
    },
    mapShort: {
        height: 100,
        zIndex: -1
    },
    backgroundColor: {
        backgroundColor: theme.backgroundColor
    },
    buttonGroupView: {
        flex: 3,
        backgroundColor: theme.backgroundColor
    },
    buttonTitleStyle: {
        color: theme.buttonTextColor,
        fontSize: 16
    },
    textStyle: {
        color: theme.drawerText,
    },
    buttonGroupContainer: {
        height: 35,
        borderColor: theme.buttonColor,
        borderWidth: 2,
        backgroundColor: theme.buttonGroup,
    },
    buttonGroupInactive: {
        color: '#736f73'
    },
    innerBorderStyle: {
        width: 1,
        color: theme.buttonGBorder
    },
    selButtonStyle: {
        backgroundColor: theme._fff,
    },
    selTextStyle: {
        color: theme.buttonGTextColor,
        fontWeight: 'bold',
    },
    listContainerStyle: {
        backgroundColor: theme._fff
    },
    machineName: {
        color: theme.machineName,
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
        marginLeft: 25,
        marginRight: 25,
        height: 2,
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: theme.hr
    },
    font18: {
        fontSize: 18
    },
    marginB8: {
        marginBottom: 8
    },
    marginRight: {
        marginRight: 60
    },
    street: {
        fontWeight: 'bold'
    },
    link: {
        textDecorationLine: 'underline',
        color: theme.pbmText,
        fontSize: 16
    },
    italic: {
        fontStyle: 'italic',
        color: theme.d_9a836a
    },
    notItalic: {
        fontStyle: 'normal',
        color: theme.meta
    },
    meta: {
        fontSize: 16,
        color: theme.meta
    },
    iconStyle: {
        fontSize: 32,
        color: '#97a5af',
    },
    confirmButton: {
        width: '100%'
    },
    condition: {
        marginTop: 5
    },
    conditionText: {
        color: theme.placeholder,
        fontSize: 12,
        fontStyle: 'italic',
        marginLeft: 10,
        paddingBottom: 5
    },
    lastUpdated: {
        textAlign: 'center',
        marginTop: 5,
        color: theme.drawerText
    },
    commentUpdated: {
        color: theme.drawerText,
        marginLeft: 2
    },
    buttonIcon: {
        color: "#878d92",
        fontSize: 24,
        marginRight: 10
    },
    buttonContainer: {
        marginLeft: 40,
        marginRight: 40,
        marginTop: 10,
        marginBottom: 10
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
        top: 0,
        right: 5,
        fontSize: 24,
        color: '#F53240',
        padding: 10
    },
    savedIcon: {
        color: theme.buttonTextColor,
        fontSize: 24,
        marginRight: 5
    },
    savedLink: {
        borderWidth: 2,
        borderColor: theme.buttonColor,
    },
    margin15: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 0,
        marginBottom: 15
    },
    borderBottom: {
        borderBottomColor: theme.borderColor,
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
