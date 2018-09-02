import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Autocomplete from 'react-native-autocomplete-input'
import { getData } from '../config/request'
import { updateQuery, setLocationId, updateCurrCoordindates } from '../actions/query_actions'
import { fetchLocations } from '../actions/locations_actions';

import Geocode from "react-geocode"

const apiKey = process.env['API_KEY'];
Geocode.setApiKey(apiKey)

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
            <View style={{flexDirection: 'row'}}>
            <Autocomplete
                data={this.state.foundItems} 
                defaultValue={this.props.query.currQueryString}
                placeholder={'City, Address, Location'}
                style={{width: 150}}
                onChangeText={query => this.props.updateQuery(query)}
                renderItem={item => (
                <TouchableOpacity onPress={() => this.props.setLocationId(item.id, item.value)}>
                    <Text>{item.label}</Text>
                </TouchableOpacity>
                )}
            />
            <FontAwesome 
                name='location-arrow' 
                size={20} 
                onPress={() => {
                    this.props.getLocations('/locations/closest_by_lat_lon.json?lat=' + this.props.user.lat + ';lon=' + this.props.user.lon + ';send_all_within_distance=1;max_distance=5', true)
                    this.props.updateCoordinates(this.props.user.lat, this.props.user.lon)
                }}
            />
            <Button
                onPress={() => Geocode.fromAddress(this.props.query.currQueryString).then(
                    response => {
                      const { lat, lng } = response.results[0].geometry.location;
                      this.props.getLocations('/locations/closest_by_lat_lon.json?lat=' + lat + ';lon=' + lng + ';send_all_within_distance=1;max_distance=5', true)
                      this.props.updateCoordinates(lat, lng)
                    },
                    error => {
                      console.error(error);
                    }
                  )
                }
                style={{width:30, paddingTop: 15}}
                title="Submit"
                accessibilityLabel="Submit"
            />
            </View>
        );
  }
}

const mapStateToProps = ({ query, user }) => ({ query, user})
const mapDispatchToProps = (dispatch) => ({
    getLocations: (url, isRefetch) => dispatch(fetchLocations(url, isRefetch)),
    updateCoordinates: (lat, lon) => dispatch(updateCurrCoordindates(lat, lon)),
    updateQuery: query => dispatch(updateQuery(query)), 
    setLocationId: (id, name) => dispatch(setLocationId(id, name)),
})
export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
