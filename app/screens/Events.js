import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Geocode from 'react-geocode'
import {
    FlatList,
    Linking,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import {
    ButtonGroup,
} from 'react-native-elements'
import { ThemeContext } from '../theme-context'
import { MaterialIcons } from '@expo/vector-icons'
import { HeaderBackButton, ActivityIndicator } from '../components'
import { getIfpaData } from '../config/request'
import { GOOGLE_MAPS_KEY } from '../config/keys'

const moment = require('moment')

Geocode.setApiKey(GOOGLE_MAPS_KEY)

class Events extends Component {
    state = {
        gettingEvents: true,
        refetchingEvents: false,
        events: [],
        error: false,
        address: '',
        selectedIdx: 0,
        radius: 50,
    }

    static navigationOptions = ({ navigation, theme }) => {
        return {
            drawerLabel: 'Events',
            drawerIcon: () => <MaterialIcons name='event-note' style={{fontSize: 24,color: '#95867c'}} />,
            headerLeft: () => <HeaderBackButton navigation={navigation} />,
            title: 'Nearby Events',
            headerRight: () =><View style={{padding:6}}></View>,
            headerStyle: {
                backgroundColor: theme === 'dark' ? '#1d1c1d' : '#f5f5ff',
                borderBottomWidth: 0,
                elevation: 0,
                shadowColor: 'transparent'
            },
            headerTitleStyle: {
                textAlign: 'center',
            },
            headerTintColor: theme === 'dark' ? '#fdd4d7' : '#766a62',
            gestureEnabled: true
        }
    }

    updateIdx = (selectedIdx) => {
        const radiusArray = [50, 100, 150, 200, 250]
        const radius = radiusArray[selectedIdx]
        this.setState({ selectedIdx, radius, refetchingEvents: true })
        this.fetchEvents(radius)
    }

    fetchEvents = async (radius) => {
        const distanceUnit = this.props.user.unitPreference ? 'k' : 'm'
        try {
            const data = await getIfpaData(this.state.address, radius, distanceUnit)
            this.setState({ error: false, events: data.calendar ? data.calendar : [], gettingEvents: false, refetchingEvents: false })
        }
        catch(e) {
            this.setState({ error: true, gettingEvents: false, refetchingEvents: false })
        }
    }

    componentDidMount() {
        const { lat, lon } = this.props.user
        const { curLat, curLon } = this.props.query
        const { mapLocations = [] } = this.props.locations

        let promise
        if (mapLocations.length > 0 && mapLocations[0].city && mapLocations[0].state) {
            let address = `${mapLocations[0].city}, ${mapLocations[0].state}`
            promise = () => Promise.resolve(address)

        }
        else {
            promise = () => Geocode.fromLatLng(curLat !== null ? curLat : lat, curLon !== null ? curLon : lon)
                .then(response => response.results[0].formatted_address, error => { throw error })
        }

        promise()
            .then(address => {
                this.setState({ address })
                this.fetchEvents(50)
            })
            .catch(() => this.setState({ error: true, gettingEvents: false}))
    }

    render(){
        const { events, gettingEvents, error, selectedIdx, radius, refetchingEvents } = this.state
        const distanceUnit = this.props.user.unitPreference ? 'km' : 'mi'
        const buttons = [`50 ${distanceUnit}`, `100 ${distanceUnit}`, `150 ${distanceUnit}`, `200 ${distanceUnit}`, `250 ${distanceUnit}`]

        return(
            <ThemeContext.Consumer>
                {({ theme }) => {
                    const s = getStyles(theme)
                    return (
                        <View style={{flex:1,backgroundColor: theme.base1}}>
                            {gettingEvents ?
                                <View style={s.background}>
                                    <ActivityIndicator />
                                </View> :
                                error ?
                                    <Text style={{textAlign:'center',fontWeight:Platform.OS === 'ios' ? '600' : 'bold',marginTop:15}}>Something went wrong. In the meantime, you can check the <Text style={s.textLink} onPress={() => Linking.openURL('https://www.ifpapinball.com/calendar/')}>IFPA calendar</Text> on their site.</Text> :
                                    <>
                                        <View style={s.header}>
                                            <ButtonGroup
                                                onPress={this.updateIdx}
                                                selectedIndex={selectedIdx}
                                                buttons={buttons}
                                                containerStyle={s.buttonGroupContainer}
                                                textStyle={s.buttonGroupInactive}
                                                selectedButtonStyle={s.selButtonStyle}
                                                selectedTextStyle={s.selTextStyle}
                                                innerBorderStyle={s.innerBorderStyle}
                                            />
                                        </View>
                                        {refetchingEvents ?
                                            <ActivityIndicator /> :
                                            events.length > 0 ?
                                                <View>
                                                    <Text style={s.sourceText}>
                                                        These events are brought to you by the <Text style={s.smallLink} onPress={() => Linking.openURL('https://www.ifpapinball.com/calendar/')}>International Flipper Pinball Association</Text>
                                                    </Text>
                                                <FlatList
                                                    data={events}
                                                    extraData={this.state}
                                                    renderItem={({ item }) => {
                                                        const start_date = moment(item.start_date, 'YYYY-MM-DD').format('MMM DD, YYYY')
                                                        const end_date = moment(item.end_date, 'YYYY-MM-DD').format('MMM DD, YYYY')
                                                        return (
                                                            <Pressable
                                                                style={({ pressed }) => [{},s.cardContainer,pressed ? s.pressed : s.notPressed]}
                                                                onPress={() => Linking.openURL(item.website)}
                                                            >
                                                                <View style={s.locationNameContainer}>
                                                                    <Text style={s.locationName}>{item.tournament_name}</Text>
                                                                </View>
                                                                <Text style={[s.center,s.cardTextStyle,s.margin]}>{(item.start_date === item.end_date) ? <Text>{start_date}</Text> : <Text>{start_date} - {end_date}</Text>}</Text>
                                                                <Text style={[s.cardTextStyle,s.margin,s.padding]}>{item.details.substring(0, 100)}{item.details.length > 99 ? '...' : ''}</Text>
                                                                <Text style={[s.address,s.margin,s.padding]}>{item.address1}{item.city.length > 0 & item.address1.length > 0 ? <Text>, </Text>: ''}{item.city}{item.state.length > 0 ? <Text>, {item.state}</Text> : ''}</Text>
                                                            </Pressable>
                                                        )
                                                    }}
                                                    keyExtractor={event => `${event.calendar_id}`}
                                                /></View>  :
                                                <Text style={s.problem}>{`No IFPA-sanctioned events found within ${radius} miles of current map location.`}</Text>
                                        }
                                    </>

                            }
                        </View>
                    )
                }}
            </ThemeContext.Consumer>
        )
    }
}

const getStyles = theme => StyleSheet.create({
    background: {
        padding: 30,
        backgroundColor: theme.base1
    },
    header: {
        paddingVertical: 10,
    },
    buttonGroupContainer: {
        height: 40,
        borderWidth: 0,
        borderRadius: 25,
        backgroundColor: theme.base3,
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 6,
        overflow: 'visible'
    },
    buttonGroupInactive: {
        color: theme.orange8,
        fontSize: 14,
    },
    innerBorderStyle: {
        width: 0,
    },
    selButtonStyle: {
        borderWidth: 4,
        borderColor: theme.base4,
        backgroundColor: theme.white,
        borderRadius: 25
    },
    selTextStyle: {
        color: theme.orange8,
        fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    },
    locationNameContainer: {
        backgroundColor: theme.blue1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingVertical: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: -2,
        marginHorizontal: -2
    },
    locationName: {
        fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
        fontSize: 16,
        textAlign: 'center',
        color: theme.text
    },
    margin: {
        marginTop: 10,
    },
    padding: {
        paddingHorizontal: 10,
        paddingBottom: 10
    },
    problem: {
        textAlign: "center",
        color: theme.text,
        fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
        marginTop: 20,
        paddingHorizontal: 10,
        fontSize: 14
    },
    sourceText: {
        textAlign: "center",
        color: theme.orange7,
        fontSize: 12,
        marginTop: 0,
        paddingHorizontal: 10
    },
    smallLink: {
        textDecorationLine: 'underline',
        color: '#7cc5ff',
        fontSize: 12
    },
    cardContainer: {
        padding: 0,
        borderRadius: 15,
        marginBottom: 12,
        marginTop: 12,
        marginRight: 20,
        marginLeft: 20,
        backgroundColor: theme.white,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 6,
        shadowColor: theme.shadow,
    },
    center: {
        textAlign: 'center'
    },
    cardTextStyle: {
        fontSize: 14,
        color: theme.orange8
    },
    address: {
        fontSize: 12,
        color: theme.text
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
    textLink: {
        textDecorationLine: 'underline',
        color: '#7cc5ff',
        fontSize: 16,
    }
})

Events.propTypes = {
    navigation: PropTypes.object,
    user: PropTypes.object,
    locations: PropTypes.object,
    query: PropTypes.object,
}

const mapStateToProps = ({ locations, query, user }) => ({ locations, query, user })
export default connect(mapStateToProps, null)(Events)
