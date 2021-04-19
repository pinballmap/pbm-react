import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Geocode from 'react-geocode'
import {
    ActivityIndicator,
    FlatList,
    Linking,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import {
    ButtonGroup,
    Card,
} from 'react-native-elements'
import { ThemeContext } from '../theme-context'
import { MaterialIcons } from '@expo/vector-icons'
import { HeaderBackButton } from '../components'
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
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: 'Nearby Events',
            headerRight:<View style={{padding:6}}></View>,
            headerStyle: {
                backgroundColor: theme === 'dark' ? '#1d1c1d' : '#fffbf5',
                borderBottomWidth: 0,
                elevation: 0
            },
            headerTintColor: theme === 'dark' ? '#fdd4d7' : '#766a62',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1,
                fontSize: 20
            },
            gesturesEnabled: true
        }
    }

    updateIdx = (selectedIdx) => {
        const radiusArray = [50, 100, 150, 200, 250]
        const radius = radiusArray[selectedIdx]
        this.setState({ selectedIdx, radius, refetchingEvents: true })
        this.fetchEvents(radius)
    }

    fetchEvents = async (radius) => {
        try {
            const data = await getIfpaData(this.state.address, radius)
            this.setState({ events: data.calendar ? data.calendar : [], gettingEvents: false, refetchingEvents: false })
        }
        catch(e) {
            throw e
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

        return(
            <ThemeContext.Consumer>
                {({ theme }) => {
                    const s = getStyles(theme)
                    return (
                        <View style={{backgroundColor: theme.neutral}}>
                            {gettingEvents ?
                                <View style={s.background}>
                                    <ActivityIndicator />
                                </View> :
                                error ?
                                    <Text style={{textAlign:'center',fontWeight:'bold',marginTop:15}}>Oops. Something went wrong.</Text> :
                                    <>
                                        <View style={s.header}>
                                            <ButtonGroup
                                                onPress={this.updateIdx}
                                                selectedIndex={selectedIdx}
                                                buttons={['50 mi', '100 mi', '150 mi', '200 mi', '250 mi']}
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
                                                <FlatList
                                                    data={events}
                                                    extraData={this.state}
                                                    renderItem={({ item }) => {
                                                        const start_date = moment(item.start_date, 'YYYY-MM-DD').format('MMM DD, YYYY')
                                                        const end_date = moment(item.end_date, 'YYYY-MM-DD').format('MMM DD, YYYY')
                                                        return (
                                                            <Card containerStyle={s.cardContainer}>
                                                                <Text style={s.textLink} onPress={() => Linking.openURL(item.website)}>{item.tournament_name}</Text>
                                                                <Text style={[s.center,s.cardTextStyle,s.margin]}>{(item.start_date === item.end_date) ? <Text>{start_date}</Text> : <Text>{start_date} - {end_date}</Text>}</Text>
                                                                <Text style={[s.cardTextStyle,s.margin]}>{item.details.substring(0, 100)}{item.details.length > 99 ? '...' : ''}</Text>
                                                                <Text style={[s.address,s.margin]}>{item.address1}{item.city.length > 0 & item.address1.length > 0 ? <Text>, </Text>: ''}{item.city}{item.state.length > 0 ? <Text>, {item.state}</Text> : ''}</Text>
                                                            </Card>
                                                        )
                                                    }}
                                                    keyExtractor={event => `${event.calendar_id}`}
                                                />  :
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
        backgroundColor: theme.neutral
    },
    header: {
        paddingVertical: 10,
    },
    buttonGroupContainer: {
        height: 40,
        borderWidth: 0,
        borderRadius: 10,
        backgroundColor: '#fff7eb',
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 5,
        overflow: 'visible'
    },
    buttonGroupInactive: {
        color: '#736f73',
        fontSize: 14,
    },
    innerBorderStyle: {
        width: 0,
    },
    selButtonStyle: {
        borderWidth: 4,
        borderColor: theme.blue1,
        backgroundColor: theme.white,
        borderRadius: 10
    },
    selTextStyle: {
        color: theme.orange8,
        fontWeight: 'bold',
    },
    textLink: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 10,
        backgroundColor: theme.orange7,
        color: theme.text,
        fontWeight: 'bold',
        marginBottom: 5
    },
    margin: {
        marginTop: 10,
    },
    problem: {
        textAlign: "center",
        color: theme.text,
        fontWeight: 'bold',
        marginTop: 20
    },
    cardContainer: {
        borderRadius: 5,
        borderColor: theme.orange3,
        backgroundColor: theme.white
    },
    center: {
        textAlign: 'center'
    },
    cardTextStyle: {
        fontSize: 16,
        color: theme.orange7
    },
    address: {
        fontSize: 12,
        color: theme.orange7
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
