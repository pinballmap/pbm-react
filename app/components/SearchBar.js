import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Autocomplete from 'react-native-autocomplete-input'
import { getData } from '../config/request'
import { updateQuery, setLocationId, updateCurrCoordindates } from '../actions/query_actions'
import { fetchLocations } from '../actions/locations_actions';

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
        
        //regex query to replace any apostrophes with proper character 
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
                style={{width: 100}}
                onChangeText={query => this.props.updateQuery(query)}
                renderItem={item => (
                <TouchableOpacity onPress={() => this.props.setLocationId(item.id)}>
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
            {/* <Button
                onPress={() =>  params.reloadMap() }
                style={{width:30, paddingTop: 15}}
                title="Submit"
                accessibilityLabel="Submit"
            /> */}
            </View>
        );
  }
}

const mapStateToProps = ({ query, user }) => ({ query, user})
const mapDispatchToProps = (dispatch) => ({
    getLocations: (url, isRefetch) => dispatch(fetchLocations(url, isRefetch)),
    updateCoordinates: (lat, lon) => dispatch(updateCurrCoordindates(lat, lon)),
    updateQuery, 
    setLocationId,
})
export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
