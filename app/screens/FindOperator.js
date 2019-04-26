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
    Text,
} from '../components'
import { 
    headerStyle,
    headerTitleStyle,
} from '../styles'



class FindOperator extends React.PureComponent {
    constructor(props) {
        super(props)

        const defaultText = this.props.navigation.getParam('type') === 'search' ? 'N/A' : 'All'
        const { operators } = this.props.operators

        this.state = {
            operators: [{name: defaultText, id: null }, ...operators],
            allOperators: [{name: defaultText, id: null }, ...operators],
            query: '',
        }   
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: <Text style={{color:'#000e18'}}>{`Select Operator`}</Text>,
            headerTitleStyle,
            headerStyle,
            headerTintColor: '#4b5862',
        }
    }

    handleSearch = query => { 
        const formattedQuery = query.toLowerCase()
        const operators = this.state.allOperators.filter(o => o.name.toLowerCase().includes(formattedQuery))
        this.setState({ query, operators })
    }

    _selectOperator = id => {
        this.props.navigation.getParam('setSelected')(id)
        this.props.navigation.goBack()
    }

    renderRow = (operator) => (
        <TouchableOpacity                           
            onPress={() => this._selectOperator(operator.item.id)}
        >
            <View style={{padding:8}}>
                <Text style={{fontSize:18}}>{operator.item.name}</Text>
            </View>    
        </TouchableOpacity>
    )

    _keyExtractor = operator => `${operator.id}`

    render() {
        
        return (
            <View style={{flex:1,backgroundColor:'#f5fbff'}}> 
                <SearchBar
                    lightTheme
                    placeholder='Filter operators...'
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
                        data={this.state.operators}
                        renderItem={this.renderRow}
                        keyExtractor={this._keyExtractor}
                    />
                </ScrollView>
            </View>)
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

FindOperator.propTypes = {
    operators: PropTypes.object,
    navigation: PropTypes.object,
}

const mapStateToProps = ({ operators }) => ({ operators })
export default connect(mapStateToProps, null)(FindOperator)