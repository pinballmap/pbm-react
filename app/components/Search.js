import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
//https://www.peterbe.com/plog/how-to-throttle-and-debounce-an-autocomplete-input-in-react
import { debounce } from 'throttle-debounce'
import { 
    Dimensions, 
    Modal,
    ScrollView,
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
} from 'react-native'
import { Input, ListItem } from 'react-native-elements'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getData } from '../config/request'
import { getLocationsByCity } from '../actions'
import { ifIphoneX } from 'react-native-iphone-x-helper'

let deviceWidth = Dimensions.get('window').width

class Search extends Component {
    constructor(props) {
        super(props)
        this.state={
            q: '',
            foundLocations: [],
            foundCities: [],
            searchModalVisible: false,
            showNoResults: false,
        }

        this.autocompleteSearchDebounced = debounce(500, this.autocompleteSearch)
        this.waitingFor = ''
    }

    changeQuery = q => {
        this.setState({ q, showNoResults: false }, () => {
            this.autocompleteSearchDebounced(this.state.q)
        })
    }

    autocompleteSearch = q => {
        this._fetch(q)
    }

    _fetch = async (query) => {        
        this.waitingFor = query
        if (query === '') {
            await this.setState({ foundLocations: [], foundCities: []})
        } else {
            const foundLocations = await getData(`/locations/autocomplete?name=${query}`)
            let foundCities = await getData(`/locations/autocomplete_city.json?name=${query}`)
            if (query === this.waitingFor) {
                this.setState({ foundLocations, foundCities, showNoResults: true })
            }
        }
    }

    render(){
        const { q, foundLocations = [], foundCities = [], searchModalVisible, showNoResults } = this.state

        return(
            <View>
                <Modal
                    transparent={true}
                    visible={searchModalVisible}
                    onRequestClose={()=>{}}
                >
                    <View style={[s.ifX,{flex:1,backgroundColor:'rgba(255,255,255,1.0)'}]}>
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                            <MaterialIcons 
                                onPress={() => {
                                    this.setState({searchModalVisible: false})
                                    this.changeQuery('')
                                }}
                                name='clear' 
                                size={30} 
                                style={{color:'#6a7d8a',marginLeft:5,marginRight:10,marginTop:6}}
                            />
                            <Input
                                placeholder='City, Address, Location'
                                leftIcon={<MaterialIcons name='search' size={25} color="#6a7d8a" style={{marginLeft:-10,marginRight:-8}}/>}
                                rightIcon={q ? <MaterialCommunityIcons name='close-circle' size={20} color="#97a5af" style={{marginRight:2}} onPress={() => this.changeQuery('')} /> : null}
                                onChangeText={query => this.changeQuery(query)}
                                value={q}
                                containerStyle={{paddingTop:4}}
                                inputContainerStyle={s.input}
                                autoFocus
                            />
                        </View>
                        <ScrollView style={{paddingTop: 3}} keyboardShouldPersistTaps="handled">
                            {foundCities ? 
                                foundCities.map(location => 
                                    (<TouchableOpacity 
                                        key={location.value} 
                                        onPress={() => {
                                            this.props.getLocationsByCity(location.value, this.props.navigate)
                                            this.changeQuery('')
                                            this.setState({searchModalVisible: false})
                                        }}>
                                        <ListItem
                                            title={location.value}
                                            rightTitle={'City'}
                                            rightTitleStyle={{fontStyle:'italic',color:'#97a5af'}}
                                            titleStyle={{color:'#4b5862',marginBottom:-2,marginTop:-2}}
                                            containerStyle={{borderBottomColor:'#97a5af',borderBottomWidth:1,backgroundColor:'#f2f4f5'}}
                                        /> 
                                    </TouchableOpacity>)
                                ) : null
                            }
                            {foundLocations ? 
                                foundLocations.map(location => 
                                    (<TouchableOpacity 
                                        key={location.id} 
                                        onPress={() => {
                                            this.props.navigate('LocationDetails', {id: location.id, locationName: location.label})
                                            this.changeQuery('')
                                            this.setState({searchModalVisible: false})
                                        }}>
                                        <ListItem
                                            title={location.label}
                                            titleStyle={{color:'#4b5862',marginBottom:-2,marginTop:-2}}
                                            containerStyle={{borderBottomColor:'#97a5af',borderBottomWidth:1}}
                                        /> 
                                    </TouchableOpacity>)
                                ) : null
                            }                        
                            {foundLocations.length === 0 && foundCities.length === 0 && q !== '' && showNoResults ? 
                                <Text style={s.noResults}>No search results...</Text> : null 
                            }
                        </ScrollView>
                    </View>
                </Modal>
                <TouchableOpacity onPress={() => this.setState({searchModalVisible: true})}>
                    <View style={s.searchMap}>
                        <MaterialIcons name='search' size={25} color="#97a5af" style={s.searchIcon} />
                        <Text></Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

Search.propTypes = {
    getLocationsByCity: PropTypes.func,
}

const s = StyleSheet.create({
    ifX: {
        ...ifIphoneX({
            paddingTop: 33,
        }, {
            paddingTop: 20
        })
    },
    searchMap: {
        width: deviceWidth - 115,
        backgroundColor: '#e3e5e8',
        height: 36,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row'
    },
    searchIcon: {
        paddingTop: 5,
        paddingLeft: 5
    },
    input: {
        borderWidth: 0,
        borderColor: '#e3e5e8',
        borderRadius: 5,
        width: deviceWidth - 60,
        backgroundColor: '#e3e5e8',
        height: 36,
        display: 'flex',
        flexDirection: 'row',
        paddingLeft:0
    },
    noResults: {
        paddingTop: 15,
        paddingLeft: 20,
    }
})

Search.propTypes = {
    navigate: PropTypes.func,
}

const mapStateToProps = ({ query, user }) => ({ query, user})
const mapDispatchToProps = (dispatch) => ({
    getLocationsByCity: (city, navigate) => dispatch(getLocationsByCity(city, navigate)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Search)
