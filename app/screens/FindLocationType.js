import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { 
    ScrollView, 
    StyleSheet, 
    TouchableOpacity, 
    View, 
} from 'react-native'
import { SearchBar } from 'react-native-elements'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FlatList } from 'react-native-gesture-handler'
import { 
    HeaderBackButton,
    Screen,
    Text,
} from '../components'

class FindLocationType extends React.PureComponent {
    constructor(props) {
        super(props)

        const defaultText = this.props.navigation.getParam('type') === 'search' ? 'N/A' : 'All'
        const { locationTypes } = this.props.locations

        this.state = {
            locationTypes: [{name: defaultText, id: -1 }, ...locationTypes],
            allLocationTypes: [{name: defaultText, id: -1 }, ...locationTypes],
            query: '',
        }   
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: 'Select Location Type'
        }
    }

    handleSearch = query => { 
        const formattedQuery = query.toLowerCase()
        const locationTypes = this.state.allLocationTypes.filter(o => o.name.toLowerCase().includes(formattedQuery))
        this.setState({ query, locationTypes })
    }

    _selectLocationType = id => {
        this.props.navigation.getParam('setSelected')(id)
        this.props.navigation.goBack()
    }

    renderRow = (locationType) => (
        <TouchableOpacity                           
            onPress={() => this._selectLocationType(locationType.item.id)}
        >
            <View style={{padding:8}}>
                <Text style={{fontSize:18}}>{locationType.item.name}</Text>
            </View>    
        </TouchableOpacity>
    )

    _keyExtractor = locationType => `${locationType.id}`

    render() {
        
        return (
            <Screen>
                <SearchBar
                    lightTheme
                    placeholder='Filter location types...'
                    platform='default'
                    searchIcon={<MaterialIcons name='search' size={25} color="#97a5af" />}
                    clearIcon={<MaterialCommunityIcons name='close-circle' size={20} color="#97a5af" onPress={() => this.handleSearch('')} />}
                    onChangeText={this.handleSearch}
                    inputStyle={{color:'#000e18'}}
                    value={this.state.query}
                    inputContainerStyle={s.filterInput}
                    containerStyle={{backgroundColor:'#f5fbff'}}
                />
                <ScrollView keyboardDismissMode="on-drag">
                    <FlatList
                        data={this.state.locationTypes}
                        renderItem={this.renderRow}
                        keyExtractor={this._keyExtractor}
                    />
                </ScrollView>
            </Screen>)
    }
}

const s = StyleSheet.create({
    filterInput: {
        height:35,
        backgroundColor:'#e0ebf2',
        borderRadius:10,
        borderColor: '#d1dfe8',
        borderWidth:1
    },
})

FindLocationType.propTypes = {
    locationTypes: PropTypes.object,
    locations: PropTypes.object,
    navigation: PropTypes.object,
}

const mapStateToProps = ({ locations }) => ({ locations })
export default connect(mapStateToProps, null)(FindLocationType)