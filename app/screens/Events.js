import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Geocode from 'react-geocode'
import { 
    ActivityIndicator,
    FlatList,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    View, 
} from 'react-native'
import {
    Card,
} from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { HeaderBackButton } from '../components'
import { getIfpaData } from '../config/request'
import { IFPA_API_KEY, GOOGLE_MAPS_KEY } from '../config/keys'

const moment = require('moment')

Geocode.setApiKey(GOOGLE_MAPS_KEY)

class Events extends Component {
    state = {
        gettingEvents: true,
        events: [],
        error: false,
    }
  
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'Events',
            drawerIcon: () => <MaterialIcons name='event-note' style={[s.drawerIcon]} />,
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: 'Nearby Events',
            headerStyle: {
                backgroundColor:'#f5fbff',
                ...ifIphoneX({
                    paddingTop: 30,
                    height: 60
                }, {
                    paddingTop: 0
                })               
            },
            headerTintColor: '#4b5862'
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
            .then(async address => {
                try {
                    const data = await getIfpaData(`https://api.ifpapinball.com/v1/calendar/search?api_key=${IFPA_API_KEY}&address=${address}`)
                    this.setState({ events: data.calendar ? data.calendar : [], gettingEvents: false})
                }
                catch(e) {
                    throw e
                }
            })
            .catch(e => this.setState({ error: true, gettingEvents: false}))
    }
     
    render(){
        const { events, gettingEvents, error } = this.state

        return(
            <View style={{flex: 1,backgroundColor:'#f5fbff'}}>
                {gettingEvents ? 
                    <ActivityIndicator /> :
                    error ? 
                        <Text style={{textAlign:'center',fontWeight:'bold',marginTop:15}}>Oops. Something went wrong.</Text> :
                        events.length > 0 ?
                            <ScrollView>
                                <View style={s.header}>
                                    <Text style={[s.title,s.headerText]}>Upcoming Events</Text> 
                                    <Text style={[s.paren,s.headerText]}>(within 50 miles)</Text>
                                </View>
                                <FlatList
                                    data={events}
                                    extraData={this.state}
                                    renderItem={({ item }) => {
                                        const start_date = moment(item.start_date, 'YYYY-MM-DD').format('MMM-DD-YYYY')
                                        const end_date = moment(item.end_date, 'YYYY-MM-DD').format('MMM-DD-YYYY')
                                        return (
                                            <Card containerStyle={{borderRadius: 5,borderColor: "#D3ECFF"}}>
                                                <Text style={s.textLink} onPress={() => Linking.openURL(item.website)}>{item.tournament_name}</Text>
                                                <Text style={[{textAlign:'center',fontSize:16,color:'#6a7d8a'},s.margin]}>{(item.start_date === item.end_date) ? <Text>{start_date}</Text> : <Text>{start_date} - {end_date}</Text>}</Text>
                                                <Text style={s.margin}>{item.details.substring(0, 100)}{item.details.length > 99 ? '...' : ''}</Text>
                                                <Text style={[{fontSize:12,color:'#4b5862'},s.margin]}>{item.address1}{item.city.length > 0 & item.address1.length > 0 ? <Text>, </Text>: ''}{item.city}{item.state.length > 0 ? <Text>, {item.state}</Text> : ''}</Text>
                                            </Card>
                                        )
                                    }}
                                    keyExtractor={event => `${event.calendar_id}`}
                                />
                            </ScrollView> : 
                            <Text>No Events Found</Text>
                }
            </View>)
    }
}

const s = StyleSheet.create({ 
    header: {
        backgroundColor: "#6a7d8a",
        paddingTop: 10,
        paddingBottom: 10,        
    },
    headerText: {
        color: "#f5fbff",
        textAlign: "center"
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    paren: {
        fontSize: 12,
        fontStyle: "italic"
    },
    drawerIcon: {
        fontSize: 24,
        color: '#6a7d8a'
    },
    textLink: {
        fontSize: 14,
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#D3ECFF",
        fontWeight: 'bold',
        marginBottom: 5
    },
    margin: {
        marginTop: 10,
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