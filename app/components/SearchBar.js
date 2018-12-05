import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Text, TouchableOpacity, View, StyleSheet, Dimensions, Platform } from 'react-native'
import { Button } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Autocomplete from 'react-native-autocomplete-input'
import { getData } from '../config/request'
import { updateQuery, setLocationId, updateCurrCoordindates } from '../actions/query_actions'
import { fetchLocations } from '../actions/locations_actions'

import Geocode from "react-geocode"

const apiKey = process.env['API_KEY']
Geocode.setApiKey(apiKey)

let deviceWidth = Dimensions.get('window').width

// Enable or disable logs. Its optional.
//Geocode.enableDebug();

class SearchBar extends Component {
    constructor(props) {
        super(props)
        this.state={
            foundItems: [],
        }
    }
    
    findItem = async (query) => {
        if (query === '')
            return this.setState({ foundItems: []})
        
        const foundItems = await getData(`/locations/autocomplete?name=${query}`)
        this.setState({ foundItems })
    }

    componentWillReceiveProps(props) {
        this.findItem(props.query.currQueryString)
    }

    render(){
        return(
            <View style={Platform.OS === 'android' ? s.viewAndroid : s.viewIOS}>
                <Autocomplete
                    data={this.state.foundItems} 
                    defaultValue={this.props.query.currQueryString}
                    placeholder={'City, Address, Location'}
                    style={s.searchBox}
                    inputContainerStyle={s.inputContainer}
                    listContainerStyle={s.listContainer}
                    listStyle={s.list}
                    containerStyle={Platform.OS === 'android' ? s.androidAutocompleteContainer : null}
                    underlineColorAndroid='transparent'
                    selectionColor='#000000'
                    onChangeText={query => this.props.updateQuery(query)}
                    renderItem={item => (
                        <TouchableOpacity onPress={() => this.props.setLocationId(item.id, item.value)}>
                            <Text style={s.autoComplete}>{item.label}</Text>
                        </TouchableOpacity>
                    )}
                />
                <Button
                    onPress={() => Geocode.fromAddress(this.props.query.currQueryString).then(
                        response => {
                            const { lat, lng } = response.results[0].geometry.location
                            this.props.getLocations('/locations/closest_by_lat_lon.json?lat=' + lat + ';lon=' + lng + ';send_all_within_distance=1;max_distance=5', true)
                            this.props.updateCoordinates(lat, lng)
                        },
                        error => {
                            console.error(error)
                        }
                    )
                    }
                    containerStyle={{width:30,marginLeft:-30,marginTop:5}}
                    title=""
                    accessibilityLabel=""
                    icon={<MaterialIcons name='search' size={25} />}
                    buttonStyle={s.addButton}
                    clear
                />
                <FontAwesome 
                    name='location-arrow' 
                    size={20}
                    style={s.location}
                    onPress={() => {
                        this.props.getLocations('/locations/closest_by_lat_lon.json?lat=' + this.props.user.lat + ';lon=' + this.props.user.lon + ';send_all_within_distance=1;max_distance=5', true)
                        this.props.updateCoordinates(this.props.user.lat, this.props.user.lon)
                    }}
                />
            </View>
        )
    }
}

const s = StyleSheet.create({
    autoComplete: {
        color: "#260204",
        padding: 5
    },
    viewIOS: {
        flexDirection: 'row',
    },
    viewAndroid: {
        flexDirection: 'row',
        position: "absolute",
        top: 12,
        zIndex: 999
    },
    addButton: {
        backgroundColor: "transparent",
        paddingLeft: 5
    },
    searchBox: {
        width: deviceWidth - 140,
        height: 30,
        padding: 5,
    },
    listContainer: {
        width: deviceWidth - 140,
        //zIndex: 999,
    },
    list: {
        //zIndex: 999,
        //maxHeight: 400
    },
    location: {
        marginLeft: 5,
        marginTop: 5,
        color: "#260204"
    },
    inputContainer: {
        //borderRadius: 5,   
    },
    androidAutocompleteContainer: {
        zIndex: 999,
    }
})

SearchBar.propTypes = {
    query: PropTypes.object,
    user: PropTypes.object,
    getLocations: PropTypes.func,
    updateCoordinates: PropTypes.func,
    updateQuery: PropTypes.func,
    setLocationId: PropTypes.func,
}

const mapStateToProps = ({ query, user }) => ({ query, user})
const mapDispatchToProps = (dispatch) => ({
    getLocations: (url, isRefetch) => dispatch(fetchLocations(url, isRefetch)),
    updateCoordinates: (lat, lon) => dispatch(updateCurrCoordindates(lat, lon)),
    updateQuery: query => dispatch(updateQuery(query)), 
    setLocationId: (id, name) => dispatch(setLocationId(id, name)),
})
export default connect(mapStateToProps, mapDispatchToProps)(SearchBar)
