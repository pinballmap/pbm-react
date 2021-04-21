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

    const renderRow = ({ item, index}) => (
        <TouchableOpacity
            onPress={() => _selectLocationType(item.id)}
        >
            <View style={{padding:8, backgroundColor: index % 2 === 0 ? 'blue' : 'red'}}>
                <Text style={{fontSize:18}}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    )

    const _keyExtractor = locationType => `${locationType.id}`

    return (
        <>
            <SearchBar
                lightTheme={theme.theme !== 'dark'}
                placeholder='Filter location types...'
                placeholderTextColor={theme.indigo4}
                platform='default'
                searchIcon={<MaterialIcons name='search' size={25} color={theme.indigo4} />}
                clearIcon={<MaterialCommunityIcons name='close-circle' size={20} color={theme.indigo4} onPress={() => handleSearch()}/>}
                onChangeText={handleSearch}
                inputStyle={{color:theme.text}}
                value={query}
                inputContainerStyle={s.filterInput}
                containerStyle={{backgroundColor:theme.neutral,borderBottomWidth:0}}
            />
            <FlatList
                data={selectedLocationTypes}
                renderItem={renderRow}
                keyExtractor={_keyExtractor}
                style={{backgroundColor:theme.neutral}}
            />
        </>)
}

FindLocationType.navigationOptions = ({ navigation, theme }) => ({
    headerLeft: <HeaderBackButton navigation={navigation} />,
    title: 'Select Location Type',
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#1d1c1d' : '#fffbf5',
        borderBottomWidth: 0
    },
    headerTintColor: theme === 'dark' ? '#fdd4d7' : '#766a62',
    headerTitleStyle: {
        textAlign: 'center',
        flex: 1,
        fontSize: 20
    },
    gesturesEnabled: true
})

const getStyles = theme => StyleSheet.create({
    filterInput: {
        height: 35,
        backgroundColor: theme.white,
        borderRadius: 10,
        borderColor: theme.orange3,
        borderWidth: 1,
        borderBottomWidth: 1

    },
})

FindLocationType.propTypes = {
    locationTypes: PropTypes.object,
    locations: PropTypes.object,
    navigation: PropTypes.object,
}

const mapStateToProps = ({ locations }) => ({ locations })
export default connect(mapStateToProps, null)(FindLocationType)
