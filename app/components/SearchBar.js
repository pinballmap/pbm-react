import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input'
import { getData } from '../config/request'
import { updateQuery, setLocationId } from '../actions/query_actions'

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
                style={{width: 100}}
                onChangeText={query => this.props.updateQuery(query)}
                renderItem={item => (
                <TouchableOpacity onPress={() => this.props.setLocationId(item.id)}>
                    <Text>{item.label}</Text>
                </TouchableOpacity>
                )}
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

const mapStateToProps = ({ query }) => ({ query})
export default connect(mapStateToProps, { updateQuery, setLocationId })(SearchBar);
