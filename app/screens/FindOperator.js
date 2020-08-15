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

    const renderRow = (operator) => (
        <TouchableOpacity                           
            onPress={() => _selectOperator(operator.item.id)}
        >
            <View style={{padding:8}}>
                <Text style={{fontSize:18}}>{operator.item.name}</Text>
            </View>    
        </TouchableOpacity>
    )

    const _keyExtractor = operator => `${operator.id}`
        
    return (
        <> 
            <SearchBar
                lightTheme={theme.theme !== 'dark'}
                placeholder='Filter operators...'
                placeholderTextColor={theme.placeholder}
                platform='default'
                searchIcon={<MaterialIcons name='search' size={25} color={theme._97a5af} />}
                clearIcon={<MaterialCommunityIcons name='close-circle' size={20} color={theme._97a5af} onPress={() => handleSearch()} />}
                onChangeText={handleSearch}
                inputStyle={{color:theme.pbmText}}
                value={query}
                inputContainerStyle={s.filterInput}
                containerStyle={s.containerStyle}
            />
            <FlatList
                data={selectedOperators}
                renderItem={renderRow}
                keyExtractor={_keyExtractor}
            />
        </>)
}

const getStyles = theme => StyleSheet.create({
    filterInput: {
        height: 35,
        backgroundColor: theme.findInput,
        borderRadius: 10,
        borderColor: theme.borderColor,
        borderWidth: 1
    },
    containerStyle: {
        backgroundColor: theme.d_493931,
    }
})

FindOperator.navigationOptions = ({ navigation, theme }) => ({
    headerLeft: <HeaderBackButton navigation={navigation} />,
    title: 'Select Operator',
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

FindOperator.propTypes = {
    operators: PropTypes.object,
    navigation: PropTypes.object,
}

const mapStateToProps = ({ operators }) => ({ operators })
export default connect(mapStateToProps, null)(FindOperator)
