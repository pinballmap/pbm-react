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
    ButtonGroup,
    Card,
} from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'
import { HeaderBackButton, Screen } from '../components'
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
  
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'Events',
            drawerIcon: () => <MaterialIcons name='event-note' style={[s.drawerIcon]} />,
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: 'Nearby Events',
            headerRight:<View style={{padding:6}}></View>,
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
            <Screen>
                {gettingEvents ? 
                    <View style={{padding: 30}}>
                        <ActivityIndicator />
                    </View> :
                    error ? 
                        <Text style={{textAlign:'center',fontWeight:'bold',marginTop:15}}>Oops. Something went wrong.</Text> :
                        <ScrollView>
                            <View style={s.header}>
                                <Text style={[s.title,s.headerText]}>Upcoming Events Within</Text> 
                                <ButtonGroup
                                    onPress={this.updateIdx}
                                    selectedIndex={selectedIdx}
                                    buttons={['50 mi', '100 mi', '150 mi', '200 mi', '250 mi']}
                                    containerStyle={{ height: 40, borderColor:'#e0ebf2', borderWidth: 2 }}
                                    selectedButtonStyle={s.buttonStyle}
                                    selectedTextStyle={s.textStyle}
                                />
                            </View>
                            {refetchingEvents ?
                                <ActivityIndicator /> :
                                events.length > 0 ?
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
                                    />  : 
                                    <Text style={s.problem}>{`No IFPA-sanctioned events found within ${radius} miles of current map location.`}</Text>
                            }
                        </ScrollView>
                            
                }
            </Screen>)
    }
}

const s = StyleSheet.create({ 
    header: {
        backgroundColor: "#6a7d8a",
        paddingVertical: 10,
    },
    headerText: {
        color: "#f5fbff",
        textAlign: "center"
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonStyle: {
        backgroundColor: '#D3ECFF',
    },
    textStyle: {
        color: '#000e18',
        fontWeight: 'bold',
    },
    drawerIcon: {
        fontSize: 24,
        color: '#6a7d8a'
    },
    textLink: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 10,
        backgroundColor: "#D3ECFF",
        fontWeight: 'bold',
        marginBottom: 5
    },
    margin: {
        marginTop: 10,
    },    
    problem: {
        textAlign: "center",
        color: '#000e18',
        fontWeight: 'bold',
        marginTop: 20
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