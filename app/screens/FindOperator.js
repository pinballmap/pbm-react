import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { 
    ScrollView, 
    StyleSheet, 
    TouchableOpacity, 
    View, 
} from 'react-native'
import { SearchBar, ThemeContext } from 'react-native-elements'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FlatList } from 'react-native-gesture-handler'
import { 
    HeaderBackButton,
    Screen,
    Text,
} from '../components'

const FindOperator = ({ navigation, operators: { operators = [] } }) => {
    const theme = useContext(ThemeContext)
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
        <Screen> 
            <SearchBar
                lightTheme
                placeholder='Filter operators...'
                platform='default'
                searchIcon={<MaterialIcons name='search' size={25} color="#97a5af" />}
                clearIcon={<MaterialCommunityIcons name='close-circle' size={20} color="#97a5af" onPress={handleSearch} />}
                onChangeText={handleSearch}
                inputStyle={{color:'#000e18'}}
                value={query}
                inputContainerStyle={s.filterInput}
                containerStyle={{backgroundColor:'#f5fbff'}}
            />
            <ScrollView keyboardDismissMode="on-drag">
                <FlatList
                    data={selectedOperators}
                    renderItem={renderRow}
                    keyExtractor={_keyExtractor}
                />
            </ScrollView>
        </Screen>)
}

const getStyles = theme => StyleSheet.create({
    filterInput: {
        height:35,
        backgroundColor:'#e0ebf2',
        borderRadius:10,
        borderColor: '#d1dfe8',
        borderWidth:1
    },
})

FindOperator.navigationOptions = ({ navigation }) => ({
    headerLeft: <HeaderBackButton navigation={navigation} />,
    title: 'Select Operator',
})

FindOperator.propTypes = {
    operators: PropTypes.object,
    navigation: PropTypes.object,
}

const mapStateToProps = ({ operators }) => ({ operators })
export default connect(mapStateToProps, null)(FindOperator)
