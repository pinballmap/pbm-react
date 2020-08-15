import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { 
    StyleSheet, 
    TouchableOpacity, 
    View, 
} from 'react-native'
import { SearchBar } from 'react-native-elements'
import { ThemeContext } from '../theme-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FlatList } from 'react-native-gesture-handler'
import { 
    HeaderBackButton,
    Text,
} from '../components'

const FindLocationType = ({ navigation, locations: { locationTypes = [] } }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)
    
    const allLocationTypes = [{name: navigation.getParam('type') === 'search' ? 'N/A' : 'All', id: -1 }, ...locationTypes]
    const [selectedLocationTypes, setLocationTypes] = useState(allLocationTypes)
    const [query, setQuery] = useState('')

    const handleSearch = (search = '') => { 
        const formattedQuery = search.toLowerCase()
        const selectedLocationTypes = allLocationTypes.filter(o => o.name.toLowerCase().includes(formattedQuery))
        setQuery(search)
        setLocationTypes(selectedLocationTypes)
    }

    const _selectLocationType = id => {
        navigation.getParam('setSelected')(id)
        navigation.goBack()
    }

    const renderRow = (locationType) => (
        <TouchableOpacity                           
            onPress={() => _selectLocationType(locationType.item.id)}
        >
            <View style={{padding:8}}>
                <Text style={{fontSize:18}}>{locationType.item.name}</Text>
            </View>    
        </TouchableOpacity>
    )

    const _keyExtractor = locationType => `${locationType.id}`
       
    return (
        <>
            <SearchBar
                lightTheme={theme.theme !== 'dark'}
                placeholder='Filter location types...'
                placeholderTextColor={theme.placeholder}
                platform='default'
                searchIcon={<MaterialIcons name='search' size={25} color={theme._97a5af} />}
                clearIcon={<MaterialCommunityIcons name='close-circle' size={20} color={theme._97a5af} onPress={() => handleSearch()}/>}
                onChangeText={handleSearch}
                inputStyle={{color:theme.pbmText}}
                value={query}
                inputContainerStyle={s.filterInput}
                containerStyle={{backgroundColor:theme.d_493931}}
            />
            <FlatList
                data={selectedLocationTypes}
                renderItem={renderRow}
                keyExtractor={_keyExtractor}
            />
        </>)
}

FindLocationType.navigationOptions = ({ navigation, theme }) => ({
    headerLeft: <HeaderBackButton navigation={navigation} />,
    title: 'Select Location Type',
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#1d1c1d' : '#f5fbff',
    },
    headerTintColor: theme === 'dark' ? '#fdd4d7' : '#4b5862',
    headerTitleStyle: {
        textAlign: 'center', 
        flex: 1
    },
    gesturesEnabled: true
})

const getStyles = theme => StyleSheet.create({
    filterInput: {
        height: 35,
        backgroundColor: theme.findInput,
        borderRadius: 10,
        borderColor: theme.borderColor,
        borderWidth: 1
    },
})

FindLocationType.propTypes = {
    locationTypes: PropTypes.object,
    locations: PropTypes.object,
    navigation: PropTypes.object,
}

const mapStateToProps = ({ locations }) => ({ locations })
export default connect(mapStateToProps, null)(FindLocationType)
