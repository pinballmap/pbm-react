import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Geocode from 'react-geocode'
import {
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import {
    ButtonGroup,
} from '@rneui/base'
import { ThemeContext } from '../theme-context'
import { ActivityIndicator } from '../components'
import { getIfpaData } from '../config/request'
import { FlashList } from "@shopify/flash-list"

const moment = require('moment')

Geocode.setApiKey(process.env.GOOGLE_MAPS_KEY)

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
        catch (e) {
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
            .catch(() => this.setState({ error: true, gettingEvents: false }))
    }

    render() {
        const { events, gettingEvents, error, selectedIdx, radius, refetchingEvents } = this.state
        const distanceUnit = this.props.user.unitPreference ? 'km' : 'mi'
        const buttons = [`50 ${distanceUnit}`, `100 ${distanceUnit}`, `150 ${distanceUnit}`, `200 ${distanceUnit}`, `250 ${distanceUnit}`]

        return (
            <ThemeContext.Consumer>
                {({ theme }) => {
                    const s = getStyles(theme)
                    return (
                        <View style={{ flex: 1, backgroundColor: theme.base1 }}>
                            {gettingEvents ?
                                <View style={s.background}>
                                    <ActivityIndicator />
                                </View> :
                                error ?
                                    <Text style={{ textAlign: 'center', fontFamily: 'boldFont', marginTop: 15 }}>Something went wrong. In the meantime, you can check the <Text style={s.textLink} onPress={() => Linking.openURL('https://www.ifpapinball.com/calendar/')}>IFPA calendar</Text> on their site.</Text> :
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
                                                <View style={{ flex: 1, backgroundColor: theme.base1 }}>
                                                    <Text style={s.sourceText}>
                                                        These events are brought to you by the <Text style={s.smallLink} onPress={() => Linking.openURL('https://www.ifpapinball.com/calendar/')}>International Flipper Pinball Association</Text>
                                                    </Text>
                                                    <FlashList
                                                        data={events}
                                                        estimatedItemSize={events.length}
                                                        extraData={this.state}
                                                        renderItem={({ item }) => {
                                                            const start_date = moment(item.start_date, 'YYYY-MM-DD').format('MMM DD, YYYY')
                                                            const end_date = moment(item.end_date, 'YYYY-MM-DD').format('MMM DD, YYYY')
                                                            return (
                                                                <Pressable
                                                                    style={({ pressed }) => [{}, s.cardContainer, pressed ? s.pressed : s.notPressed]}
                                                                    onPress={() => Linking.openURL(item.website)}
                                                                >
                                                                    <View style={s.locationNameContainer}>
                                                                        <Text style={s.locationName}>{item.tournament_name}</Text>
                                                                    </View>
                                                                    <Text style={[s.center, s.cardTextStyle, s.margin]}>{(item.start_date === item.end_date) ? <Text>{start_date}</Text> : <Text>{start_date} - {end_date}</Text>}</Text>
                                                                    <Text style={[s.cardTextStyle, s.margin, s.padding]}>{item.details.substring(0, 100)}{item.details.length > 99 ? '...' : ''}</Text>
                                                                    <Text style={[s.address, s.margin, s.padding]}>{item.address1}{item.city.length > 0 & item.address1.length > 0 ? <Text>, </Text> : ''}{item.city}{item.state.length > 0 ? <Text>, {item.state}</Text> : ''}</Text>
                                                                </Pressable>
                                                            )
                                                        }}
                                                        keyExtractor={event => `${event.calendar_id}`}
                                                    /></View> :
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
        color: theme.text3,
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
        color: theme.text3,
        fontFamily: 'regularBoldFont',
    },
    locationNameContainer: {
        backgroundColor: theme.text3,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingVertical: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: -2,
        marginHorizontal: -2
    },
    locationName: {
        fontFamily: 'boldFont',
        fontSize: 16,
        textAlign: 'center',
        color: theme.base2
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
        fontFamily: 'boldFont',
        marginTop: 20,
        paddingHorizontal: 10,
        fontSize: 14
    },
    sourceText: {
        textAlign: "center",
        color: theme.text2,
        fontSize: 12,
        marginTop: 0,
        marginBottom: 5,
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
        color: theme.text
    },
    address: {
        fontSize: 12,
        color: theme.text3
    },
    pressed: {
        borderColor: theme.pink2,
        borderWidth: 2,
        shadowColor: 'transparent',
        opacity: 0.8,
        elevation: 0,
    },
    notPressed: {
        borderColor: 'transparent',
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
