import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
//https://www.peterbe.com/plog/how-to-throttle-and-debounce-an-autocomplete-input-in-react
import { debounce } from 'throttle-debounce'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { Input, ListItem } from 'react-native-elements'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { getData } from '../config/request'

class Search extends Component {
    constructor(props) {
        super(props)
        this.state={
            q: '',
            foundItems: [],
            searchModalVisible: false
        }

        this.autocompleteSearchDebounced = debounce(500, this.autocompleteSearch)
        this.waitingFor = ''
    }

    changeQuery = q => {
        this.setState({ q }, () => {
            this.autocompleteSearchDebounced(this.state.q)
        })
    }

    autocompleteSearch = q => {
        this._fetch(q)
    }

    _fetch = async (query) => {        
        this.waitingFor = query
        if (query === '') {
            await this.setState({ foundItems: []})
        } else {
            const foundItems = await getData(`/locations/autocomplete?name=${query}`)
            if (query === this.waitingFor) 
                this.setState({ foundItems })
        }
    }

    render(){
        const { q, foundItems, searchModalVisible } = this.state

        return(
            <View>
                <Modal
                    transparent={false}
                    visible={searchModalVisible}
                    onRequestClose={()=>{}}
                >
                    <View>
                        <View style={{paddingTop: 50, display: 'flex', flexDirection: 'row'}}>
                            <Text 
                                style={{marginRight: 15, fontSize: 30, fontWeight: 'bold'}} 
                                onPress={() => {
                                    this.setState({searchModalVisible: false})
                                    this.changeQuery('')
                                }}>X
                            </Text>
                            <Input
                                placeholder='City, Address, Location'
                                leftIcon={<MaterialIcons name='search' size={25} color="#4b5862" />}
                                rightIcon={<MaterialIcons name='clear' size={20} color="#F53240" onPress={() => this.changeQuery('')} />}
                                onChangeText={query => this.changeQuery(query)}
                                value={q}
                            />
                        </View>
                        {foundItems ? 
                            foundItems.map(location => 
                                (<TouchableOpacity 
                                    key={location.id} 
                                    onPress={() => {
                                        this.props.navigate('LocationDetails', {id: location.id, locationName: location.label})
                                        this.changeQuery('')
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
                        <Text></Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

Search.propTypes = {
    navigate: PropTypes.func,
}

const mapStateToProps = ({ query, user }) => ({ query, user})
export default connect(mapStateToProps, null)(Search)
