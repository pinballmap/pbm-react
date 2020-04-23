import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
//https://www.peterbe.com/plog/how-to-throttle-and-debounce-an-autocomplete-input-in-react
import { debounce } from 'throttle-debounce'
import Geocode from 'react-geocode'
import {
    ActivityIndicator,
    AsyncStorage,
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Constants from 'expo-constants'
import {
    Input,
    ListItem,
} from 'react-native-elements'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getData } from '../config/request'
import {
    displayError,
    getLocationsByRegion,
    updateCurrCoordinates,
    getLocationsFailure,
} from '../actions'
import withThemeHOC from './withThemeHOC'
import { GOOGLE_MAPS_KEY } from '../config/keys'
import { retrieveItem } from '../config/utils'
import { ThemeContext }  from '../theme-context'

let deviceWidth = Dimensions.get('window').width

Geocode.setApiKey(GOOGLE_MAPS_KEY)

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            q: '',
            foundLocations: [],
            foundCities: [],
            foundRegions: [],
            searchModalVisible: false,
            showSubmitButton: false,
            searching: false,
            recentSearchHistory: []
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
        this.setState({ searching: true })
        if (query === '') {
            await this.setState({ foundLocations: [], foundCities: [], foundRegions: [], searching: false })
        } else {
            const foundRegions = query.toLowerCase() === 'region' ? this.props.regions.regions : this.props.regions.regions.filter(r => r.full_name.toLowerCase().includes(query.toLowerCase()))
            const foundLocations = await getData(`/locations/autocomplete?name=${encodeURIComponent(query)}`)
            let foundCities = await getData(`/locations/autocomplete_city.json?name=${encodeURIComponent(query)}`)
            if (query === this.waitingFor) {
                this.setState({ foundLocations, foundCities, foundRegions, showSubmitButton: true, searching: false })
            }
        }
    }   

    geocodeSearch = (query) => {
        this.setState({ searching: true })
        Geocode.fromAddress(query)
            .then(response => {
                const { lat, lng } = response.results[0].geometry.location
                this.props.updateCoordinates(lat, lng)
            }, error => {
                console.log(error)
                this.props.displayError('An error occurred geocoding.')
            })
            .then(() => {
                this.changeQuery('')
                this.setState({ searchModalVisible: false })
            })
    }

    getLocationsByCity = async ({ value }) => {
        try {
            const { location } = await getData(`/locations/closest_by_address.json?address=${value}`)
            this.props.updateCoordinates(location.lat, location.lon)
            this.clearSearchState({ value })
        } catch (e) {
            this.props.getLocationsFailure()
            this.clearSearchState('')
        }
    }

    goToLocation = (location) => {
        this.props.navigate('LocationDetails', { id: location.id, locationName: location.label, updateMap: true })
        this.clearSearchState(location)
    }

    getLocationsByRegion = (region) => {
        this.props.getLocationsByRegion(region)
        this.clearSearchState(region)
    }

    clearSearchState = (search) => {
        this.changeQuery('')
        this.setState({ searchModalVisible: false })
        if (search) {
            const duplicateIndex = this.isDuplicate(search)
            let currentSearchHistory = this.state.recentSearchHistory
            if (duplicateIndex > -1) {
                currentSearchHistory.splice(duplicateIndex, 1)
            }
            const updatedSearchHistory = [search, ...currentSearchHistory].slice(0, 10)
            AsyncStorage.setItem('searchHistory', JSON.stringify(updatedSearchHistory))
        }
    }

    isDuplicate = (search) => {
        const isDuplicate = this.state.recentSearchHistory.findIndex(entry => {
            if (entry.full_name) {
                if (search.full_name === entry.full_name) 
                    return true
            }

            if (entry.value) {
                if (search.value === entry.value) 
                    return true
            }

            return false
        })

        return isDuplicate
    }

    renderRegionRow = (region, s) => (
        <TouchableOpacity
            key={region.id}
            onPress={() => this.getLocationsByRegion(region)}
        >
            <ListItem
                title={region.full_name}
                rightTitle={'Region'}
                rightTitleStyle={{ fontStyle: 'italic', color: '#97a5af' }}
                titleStyle={s.listItemTitle}
                containerStyle={s.listContainerStyle}
            />
        </TouchableOpacity>
    )

    renderCityRow = (location, s) => (
        <TouchableOpacity
            key={location.value}
            onPress={() => this.getLocationsByCity(location)}
        >
            <ListItem
                title={location.value}
                rightTitle={'City'}
                rightTitleStyle={{ fontStyle: 'italic', color: '#97a5af' }}
                titleStyle={s.listItemTitle}
                containerStyle={s.listContainerStyle}
            />
        </TouchableOpacity>
    )

    renderLocationRow = (location, s) => (
        <TouchableOpacity
            key={location.id}
            onPress={() => this.goToLocation(location)}
        >
            <ListItem
                title={location.label}
                titleStyle={s.listItemTitle}
                containerStyle={s.listContainerStyle}
            />
        </TouchableOpacity>
    )

    renderRecentSearchHistory = (s) => (
        <View>
            <ListItem
                title={'Recent Search History'}
                titleStyle={s.searchHistoryTitle}
                containerStyle={s.listContainerStyle}
                contentContainerStyle={{alignItems: 'center'}}
            />
            {this.state.recentSearchHistory.map(search => {
                // Determine which rows to render based on search payload
                if (search.motd) {
                    return this.renderRegionRow(search, s)
                }

                if (search.id) {
                    return this.renderLocationRow(search, s)
                }

                if (search.value) {
                    return this.renderCityRow(search, s)
                }
            })}
        </View>
    )

    componentDidUpdate(prevProps, prevState) {
        if (this.state.searchModalVisible && !prevState.searchModalVisible) {
            retrieveItem('searchHistory')
                .then(recentSearchHistory => recentSearchHistory ? this.setState({ recentSearchHistory }) : this.setState({ recentSearchHisotry : [] }))
                .catch(() => this.setState({ recentSearchHisotry : [] }))
        }
    }

    render() {
        const { q, foundLocations = [], foundCities = [], foundRegions = [], recentSearchHistory = [], searchModalVisible, showSubmitButton, searching } = this.state
        const submitButton = foundLocations.length === 0 && foundCities.length === 0 && q !== '' && showSubmitButton

        return (
            <ThemeContext.Consumer>
                {({ theme }) => {
                    const s = getStyles(theme)
                    return (
                        <View>
                            <Modal
                                transparent={false}
                                visible={searchModalVisible}
                                onRequestClose={() => { }}
                            >
                                <View style={[{ flex: 1 }, s.ifX, s.background]}>
                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <MaterialIcons
                                            onPress={() => {
                                                this.setState({ searchModalVisible: false })
                                                this.changeQuery('')
                                            }}
                                            name='clear'
                                            size={30}
                                            style={s.clear}
                                        />
                                        <Input
                                            placeholder='City, Address, Location'
                                            leftIcon={<MaterialIcons name='search' size={25} color={theme._97a5af} style={{ marginLeft: -10, marginRight: 0 }} />}
                                            rightIcon={q ? <MaterialCommunityIcons name='close-circle' size={20} color={theme._97a5af} style={{ marginRight: 2 }} onPress={() => this.changeQuery('')} /> : null}
                                            onChangeText={query => this.changeQuery(query)}
                                            value={q}
                                            containerStyle={{ paddingTop: 4 }}
                                            key={submitButton ? 'search' : 'none'}
                                            returnKeyType={submitButton ? 'search' : 'none'}
                                            onSubmitEditing={submitButton ? ({ nativeEvent }) => this.geocodeSearch(nativeEvent.text) : () => { }}
                                            inputContainerStyle={s.inputContainerStyle}
                                            inputStyle={s.inputStyle}
                                            autoFocus
                                            autoCorrect={false}
                                        />
                                    </View>
                                    <ScrollView style={{ paddingTop: 3 }} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
                                        {searching ? <ActivityIndicator /> : null}
                                        {q === '' && recentSearchHistory.length > 0 ? this.renderRecentSearchHistory(s) : null}
                                        {foundRegions ? foundRegions.map(region => this.renderRegionRow(region, s)) : null}
                                        {foundCities ? foundCities.map(location => this.renderCityRow(location, s)) : null }
                                        {foundLocations ? foundLocations.map(location => this.renderLocationRow(location, s)) : null }
                                    </ScrollView>
                                </View>
                            </Modal>
                            <TouchableOpacity onPress={() => this.setState({ searchModalVisible: true })}>
                                <View style={s.searchMap}>
                                    <MaterialIcons name='search' size={25} style={s.searchIcon} />
                                    <Text style={s.inputPlaceholder}>City, Address, Location</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                }}
            </ThemeContext.Consumer>
        )
    }
}

Search.propTypes = {
    theme: PropTypes.string,
}

const getStyles = theme => StyleSheet.create({
    background: {
        backgroundColor: theme._f2f4f5,
    },
    ifX: {
        paddingTop: Constants.statusBarHeight > 40 ? 44 : 20,
    },
    searchMap: {
        width: Platform.OS === 'ios' ? deviceWidth - 115 : deviceWidth - 120,
        backgroundColor: theme._f2f4f5,
        height: 35,
        borderRadius: 5,
        borderColor: theme._e0ebf2,
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        marginLeft: Platform.OS === 'ios' ? -10 : 0,
        alignItems: 'center'
    },
    searchIcon: {
        paddingLeft: 5,
        color: theme._97a5af,
    },
    inputPlaceholder: {
        fontSize: deviceWidth < 321 ? 14 : 16,
        color: theme._97a5af,
    },
    inputStyle: {
        color: theme._97a5af,
    },
    inputContainerStyle: {
        borderWidth: 1,
        backgroundColor: theme._f2f4f5,
        borderRadius: 5,
        width: deviceWidth - 60,
        borderColor: '#e0ebf2',
        height: 35,
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 0,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
    },
    listContainerStyle: {
        borderBottomColor: theme.hr,
        borderBottomWidth: 1,
        backgroundColor: theme.backgroundColor
    },
    listItemTitle: {
        color: theme.buttonTextColor,
        marginBottom: -2,
        marginTop: -2
    },
    searchHistoryTitle: {
        color: theme.buttonTextColor,
        fontWeight: 'bold',
    },
    clear: {
        color: theme.meta,
        marginLeft: 5,
        marginRight: 5,
        marginTop: Platform.OS === 'ios' ? 6 : -5,
    }
})

Search.propTypes = {
    displayError: PropTypes.func,
    navigate: PropTypes.func,
    regions: PropTypes.object,
    updateCoordinates: PropTypes.func,
    getLocationsByRegion: PropTypes.func,
    getLocationsFailure: PropTypes.func,
}

const mapStateToProps = ({ regions, query, user }) => ({ regions, query, user })
const mapDispatchToProps = (dispatch) => ({
    displayError: error => dispatch(displayError(error)),
    updateCoordinates: (lat, lng) => dispatch(updateCurrCoordinates(lat, lng)),
    getLocationsByRegion: (region) => dispatch(getLocationsByRegion(region)),
    getLocationsFailure: () => dispatch(getLocationsFailure()),
})
export default connect(mapStateToProps, mapDispatchToProps)(withThemeHOC(Search))
