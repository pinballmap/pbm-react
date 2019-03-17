import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Text, TouchableOpacity, View, StyleSheet, Dimensions, Platform } from 'react-native'
import { Input, ListItem } from 'react-native-elements'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { getData } from '../config/request'
import { updateQuery, setLocationId, updateCurrCoordindates } from '../actions/query_actions'
import { fetchLocations } from '../actions/locations_actions'

class Search extends Component {
    constructor(props) {
        super(props)
        this.state={
            foundItems: [],
            searchModalVisible: false
        }
    }

    findItem = async (query) => {        
        const foundItems = await getData(`/locations/autocomplete?name=${query}`)
        query === '' ? this.setState({ foundItems: []}) : this.setState({ foundItems })
    }

    componentWillReceiveProps(props) {
        if (this.props.query.currQueryString !== props.query.currQueryString)
            this.findItem(props.query.currQueryString)
    }

    render(){
        console.log(this.state.foundItems)
        const { foundItems, searchModalVisible } = this.state
        return(
            <View>
                <Modal
                    transparent={false}
                    visible={searchModalVisible}
                    onRequestClose={()=>{}}
                >
                    <View>
                        <View style={{paddingTop: 50, display: 'flex', flexDirection: 'row'}}>
                            <Text style={{marginRight: 15, fontSize: 30, fontWeight: 'bold'}} onPress={() => this.setState({searchModalVisible: false})}>X</Text>
                            <Input
                                placeholder='City, Address, Location'
                                leftIcon={<MaterialIcons name='search' size={25} color="#4b5862" />}
                                rightIcon={<MaterialIcons name='clear' size={20} color="#F53240" onPress={() => this.handleSearch('')} />}
                                onChangeText={query => this.props.updateQuery(query)}
                            />
                        </View>
                        <Text>WTF</Text>
                        {foundItems ? 
                            foundItems.map(location => 
                                (<TouchableOpacity 
                                    key={location.id} 
                                    onPress={() => {
                                        this.props.setLocationId(location.id, location.value)
                                        this.setState({searchModalVisible: false})
                                    }}>
                                    <ListItem
                                        title={location.label}
                                    /> 
                                </TouchableOpacity>)
                            ) :
                            <Text>No search results...</Text>
                        }
                    </View>
                </Modal>
                <TouchableOpacity onPress={() => this.setState({searchModalVisible: true})}>
                    <View style={{width: 250, backgroundColor: '#e3e5e8', height: 30, borderRadius: 4, display: 'flex', flexDirection: 'row'}}>
                        <MaterialIcons name='search' size={25} color="#4b5862" />
                        <Text>HIII</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

Search.propTypes = {
}

const mapStateToProps = ({ query, user }) => ({ query, user})
const mapDispatchToProps = (dispatch) => ({
    getLocations: (url, isRefetch) => dispatch(fetchLocations(url, isRefetch)),
    updateCoordinates: (lat, lon) => dispatch(updateCurrCoordindates(lat, lon)),
    updateQuery: query => dispatch(updateQuery(query)), 
    setLocationId: (id, name) => dispatch(setLocationId(id, name)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Search)
