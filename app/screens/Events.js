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
            title: 'Events',
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
                        <Text>Oops. Something went wrong.</Text> :
                        events.length > 0 ?
                            <ScrollView>
                                <FlatList
                                    data={events}
                                    extraData={this.state}
                                    renderItem={({ item }) => {
                                        return (
                                            <Card containerStyle={{borderRadius: 50,borderColor: "#D3ECFF"}}>
                                                <Text>{item.start_date}</Text>
                                                <Text  style={s.textLink} onPress={() => Linking.openURL(item.website)}>{item.tournament_name}</Text>
                                                <Text>{item.details.substring(0, 100)}{item.details.length > 99 ? '...' : ''}</Text>
                                                <Text>{item.address1}, {item.city}, {item.state}</Text>
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
    drawerIcon: {
        fontSize: 24,
        color: '#6a7d8a'
    },
    textLink: {
        textDecorationLine: 'underline',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#D3ECFF",
        fontWeight: 'bold'
    },
})

Events.propTypes = {
    navigation: PropTypes.object,
    user: PropTypes.object, 
    locations: PropTypes.object,
    query: PropTypes.object,
}

const mapStateToProps = ({ locations, query, user }) => ({ locations, query, user })
export default connect(mapStateToProps, null)(Events)