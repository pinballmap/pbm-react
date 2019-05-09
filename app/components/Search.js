import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
//https://www.peterbe.com/plog/how-to-throttle-and-debounce-an-autocomplete-input-in-react
import { debounce } from 'throttle-debounce'
import Geocode from 'react-geocode'
import { 
    Dimensions, 
    Modal,
    Platform,
    ScrollView,
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
} from 'react-native'
import { Constants } from 'expo'
import { Input, ListItem } from 'react-native-elements'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getData } from '../config/request'
import { 
    displayError,
    getLocationsByCity,
    getLocationsByRegion,
    updateCurrCoordinates,
} from '../actions'
import { GOOGLE_MAPS_KEY } from '../config/keys'

let deviceWidth = Dimensions.get('window').width

Geocode.setApiKey(GOOGLE_MAPS_KEY)

class Search extends Component {
    constructor(props) {
        super(props)
        this.state={
            q: '',
            foundLocations: [],
            foundCities: [],
            foundRegions: [],
            searchModalVisible: false,
            showSubmitButton: false,
        }

        this.autocompleteSearchDebounced = debounce(500, this.autocompleteSearch)
        this.waitingFor = ''
    }

    changeQuery = q => {
        this.setState({ q, showSubmitButton: false }, () => {
            this.autocompleteSearchDebounced(this.state.q)
        })
    }

    autocompleteSearch = q => {
        this._fetch(q)
    }

    _fetch = async (query) => {        
        this.waitingFor = query
        if (query === '') {
            await this.setState({ foundLocations: [], foundCities: [], foundRegions: []})
        } else {
            const foundRegions = this.props.regions.regions.filter(r => r.full_name.toLowerCase().includes(query.toLowerCase()))
            const foundLocations = await getData(`/locations/autocomplete?name=${query}`)
            let foundCities = await getData(`/locations/autocomplete_city.json?name=${query}`)
            if (query === this.waitingFor) {
                this.setState({ foundLocations, foundCities, foundRegions, showSubmitButton: true })
            }
        }
    }

    geocodeSearch = (query) => {
        Geocode.fromAddress(query)
            .then(response => {
                const { lat, lng } = response.results[0].geometry.location
                this.props.updateCoordinates(lat, lng)
            },
            error => {
                console.log(error)
                this.props.displayError('An error occurred geocoding.')
            })
            .then(() => {
                this.changeQuery('')
                this.setState({searchModalVisible: false})
            })
    }

    render(){
        const { q, foundLocations = [], foundCities = [], foundRegions = [], searchModalVisible, showSubmitButton } = this.state
        const submitButton = foundLocations.length === 0 && foundCities.length === 0 && q !== '' && showSubmitButton

        return(
            <View>
                <Modal
                    transparent={true}
                    visible={searchModalVisible}
                    onRequestClose={()=>{}}
                >
                    <View style={[s.ifX,{flex:1,backgroundColor:'#f5fbff'}]}>
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                            <MaterialIcons 
                                onPress={() => {
                                    this.setState({searchModalVisible: false})
                                    this.changeQuery('')
                                }}
                                name='clear' 
                                size={30} 
                                style={s.clear}
                            />
                            <Input
                                placeholder='City, Address, Location'
                                leftIcon={<MaterialIcons name='search' size={25} color="#6a7d8a" style={{marginLeft:-10,marginRight:-8}}/>}
                                rightIcon={q ? <MaterialCommunityIcons name='close-circle' size={20} color="#97a5af" style={{marginRight:2}} onPress={() => this.changeQuery('')} /> : null}
                                onChangeText={query => this.changeQuery(query)}
                                value={q}
                                containerStyle={{paddingTop:4}}
                                key={submitButton ? 'search' : 'none'}
                                returnKeyType={submitButton ? 'search' : 'none'}
                                onSubmitEditing={submitButton ? ({nativeEvent}) => this.geocodeSearch(nativeEvent.text) : () => {}}
                                inputContainerStyle={s.input}
                                autoFocus
                            />
                        </View>
                        <ScrollView style={{paddingTop: 3}} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
                            {foundCities ? 
                                foundCities.map(location => 
                                    (<TouchableOpacity 
                                        key={location.value} 
                                        onPress={() => {
                                            this.props.getLocationsByCity(location.value)
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
                                            this.props.navigate('LocationDetails', {id: location.id, locationName: location.label, updateMap: true})
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
                            {foundRegions ?
                                foundRegions.map(region =>
                                    (<TouchableOpacity
                                        key={region.id}
                                        onPress={() => {
                                            this.props.getLocationsByRegion(region)
                                            this.changeQuery('')
                                            this.setState({searchModalVisible: false})
                                        }}
                                    >
                                        <ListItem
                                            title={region.full_name}
                                            rightTitle={'Region'}
                                            titleStyle={{color:'#4b5862',marginBottom:-2,marginTop:-2}}
                                            containerStyle={{borderBottomColor:'#97a5af',borderBottomWidth:1,backgroundColor:'#f2f4f5'}}
                                        /> 
                                    </TouchableOpacity>
                                    )) : null
                            }                      
                        </ScrollView>
                    </View>
                </Modal>
                <TouchableOpacity onPress={() => this.setState({searchModalVisible: true})}>
                    <View style={s.searchMap}>
                        <MaterialIcons name='search' size={25} color="#97a5af" style={s.searchIcon} />
                        <Text style={{fontSize:16,color:'#c1c9cf',marginTop:6}}>City, Address, Location</Text>
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
        paddingTop: Constants.statusBarHeight > 40 ? 33 : 20,         
    },
    searchMap: {
        width: Platform.OS === 'ios' ? deviceWidth - 110 : deviceWidth - 115,             
        backgroundColor: '#e0ebf2',
        height: 35,
        borderRadius: 5,
        borderColor: '#d1dfe8',
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        marginLeft: Platform.OS === 'ios' ? -15 : 0,     
    },
    searchIcon: {
        paddingTop: Platform.OS === 'ios' ? 5 : 3,
        paddingLeft: 5
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1dfe8',
        borderRadius: 5,
        width: deviceWidth - 60,
        backgroundColor: '#e0ebf2',
        height: 35,
        display: 'flex',
        flexDirection: 'row',
        paddingLeft:0,
        marginTop: Platform.OS === 'ios' ? 0 : -12,             
    },
    clear: {
        color:'#6a7d8a',
        marginLeft:5,
        marginRight:5,
        marginTop: Platform.OS === 'ios' ? 6 : -5,                     
    }
})

Search.propTypes = {
    displayError: PropTypes.func,
    navigate: PropTypes.func,
    regions: PropTypes.object,
    updateCoordinates: PropTypes.func,
    getLocationsByCity: PropTypes.func,
    getLocationsByRegion: PropTypes.func,
}

const mapStateToProps = ({ regions, query, user }) => ({ regions, query, user})
const mapDispatchToProps = (dispatch) => ({
    displayError: error => dispatch(displayError(error)),
    getLocationsByCity: (city) => dispatch(getLocationsByCity(city)),
    updateCoordinates: (lat, lng) => dispatch(updateCurrCoordinates(lat, lng)),
    getLocationsByRegion: (region) => dispatch(getLocationsByRegion(region)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Search)
