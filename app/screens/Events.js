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
            drawerIcon: () => <MaterialIcons name='event-note' style={{fontSize: 24,color: '#6a7d8a'}} />,
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: 'Nearby Events',
            headerRight:<View style={{padding:6}}></View>,
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
                        <>
                            {gettingEvents ? 
                                <View style={s.background}>
                                    <ActivityIndicator />
                                </View> :
                                error ? 
                                    <Text style={{textAlign:'center',fontWeight:'bold',marginTop:15}}>Oops. Something went wrong.</Text> :
                                    <>
                                        <View style={s.header}>
                                            <Text style={[s.title,s.headerText]}>Upcoming Events Within</Text> 
                                            <ButtonGroup
                                                onPress={this.updateIdx}
                                                selectedIndex={selectedIdx}
                                                buttons={['50 mi', '100 mi', '150 mi', '200 mi', '250 mi']}
                                                containerStyle={s.buttonGroupContainer}
                                                textStyle={s.textStyle}
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
                        </>
                    )
                }}
            </ThemeContext.Consumer>
        )
    }
}

const getStyles = theme => StyleSheet.create({ 
    background: {
        padding: 30,
        backgroundColor: theme.backgroundColor
    },
    header: {
        backgroundColor: theme._6a7d8a,
        paddingVertical: 10,
    },
    headerText: {
        color: theme._f5fbff,
        textAlign: "center"
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonStyle: {
        backgroundColor: theme.buttonColor,
    },
    buttonGroupContainer: {
        height: 40, 
        borderColor: theme.borderColor, 
        borderWidth: 2,
        backgroundColor: theme._e0ebf2,
    },
    innerBorderStyle: {
        width: 1,
        color: theme.placeholder
    },
    textStyle: {
        color: theme.buttonTextColor,
        fontWeight: 'bold',
    },
    selButtonStyle: {
        backgroundColor: theme.selButton,
    },
    selTextStyle: {
        color: theme.pbmText,
        fontWeight: 'bold',
    },
    textLink: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 10,
        backgroundColor: theme.pageTitle,
        color: theme.pbmText,
        fontWeight: 'bold',
        marginBottom: 5
    },
    margin: {
        marginTop: 10,
    },    
    problem: {
        textAlign: "center",
        color: theme.pbmText,
        fontWeight: 'bold',
        marginTop: 20
    },
    cardContainer: {
        borderRadius: 5,
        borderColor: theme.borderColor,
        backgroundColor: theme._fff
    },
    center: {
        textAlign: 'center'
    },
    cardTextStyle: {
        fontSize: 16,
        color: theme.meta
    },
    address: {
        fontSize: 12,
        color: theme.d_9a836a
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
