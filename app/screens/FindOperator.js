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

const FindOperator = ({ navigation, operators: { operators = [] } }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    const allOperators = [{name: navigation.getParam('type') === 'search' ? 'N/A' : 'All', id: -1 }, ...operators]
    const [selectedOperators, setSelectedOperators] = useState(allOperators)
    const [query, setQuery] = useState('')

    const handleSearch = (search = '') => {
        const formattedQuery = search.toLowerCase()
        const operators = allOperators.filter(o => o.name.toLowerCase().includes(formattedQuery))
        setQuery(search)
        setSelectedOperators(operators)
    }

    const _selectOperator = id => {
        navigation.getParam('setSelected')(id)
        navigation.goBack()
    }

    const renderRow = ({ item, index}) => (
        <TouchableOpacity
            onPress={() => _selectOperator(item.id)}
        >
            <View style={{padding:8, backgroundColor: index % 2 === 0 ? theme.white : theme.neutral}}>
                <Text style={{fontSize:18}}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    )

    const _keyExtractor = operator => `${operator.id}`

    return (
        <>
            <SearchBar
                lightTheme={theme.theme !== 'dark'}
                placeholder='Filter operators...'
                placeholderTextColor={theme.indigo4}
                platform='default'
                searchIcon={<MaterialIcons name='search' size={25} color={theme.indigo4} />}
                clearIcon={<MaterialCommunityIcons name='close-circle' size={20} color={theme.indigo4} onPress={() => handleSearch()} />}
                onChangeText={handleSearch}
                inputStyle={{color:theme.text}}
                value={query}
                inputContainerStyle={s.filterInput}
                containerStyle={{backgroundColor:theme.neutral,borderBottomWidth:0}}
            />
            <FlatList
                data={selectedOperators}
                renderItem={renderRow}
                keyExtractor={_keyExtractor}
                style={{backgroundColor:theme.neutral}}
            />
        </>)
}

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

FindOperator.navigationOptions = ({ navigation, theme }) => ({
    headerLeft: <HeaderBackButton navigation={navigation} />,
    title: 'Select Operator',
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#1d1c1d' : '#fffbf5',
        borderBottomWidth: 0,
        elevation: 0
    },
    headerTintColor: theme === 'dark' ? '#fdd4d7' : '#766a62',
    headerTitleStyle: {
        textAlign: 'center',
        flex: 1,
        fontSize: 20
    },
    gesturesEnabled: true
})

FindOperator.propTypes = {
    operators: PropTypes.object,
    navigation: PropTypes.object,
}

const mapStateToProps = ({ operators }) => ({ operators })
export default connect(mapStateToProps, null)(FindOperator)
