import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { ScrollView, TouchableOpacity } from 'react-native'
import { ListItem, SearchBar } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'

class FindMachine extends Component {
    state = {
        machines: this.props.machines.machines,
        allMachines: this.props.machines.machines,
        query: '',
    }
    
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#260204" onPress={() => navigation.goBack(null)} />,
            //title: <Text>{navigation.getParam('locationName')}</Text>,
        }
    }

    handleSearch = text => { 
        const formattedQuery = text.toLowerCase()
        const machines = this.state.allMachines.filter(m => m.name.toLowerCase().includes(formattedQuery))
        this.setState({ query: formattedQuery, machines })
    }

    render() {
        return (
            <ScrollView>
                <SearchBar 
                    platform='default'
                    searchIcon={false}
                    clearIcon={false}
                    onChangeText={this.handleSearch}
                />
                {this.state.machines.map(machine => (
                    <TouchableOpacity
                        key={machine.id}
                    >
                        <ListItem 
                            title={machine.name}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>)
    }
}

FindMachine.propTypes = {
    machines: PropTypes.object,
}

const mapStateToProps = ({ machines }) => ({ machines })
export default connect(mapStateToProps)(FindMachine)