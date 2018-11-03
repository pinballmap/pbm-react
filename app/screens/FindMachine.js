import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { ScrollView, Text, TouchableOpacity } from 'react-native'
import { ListItem, SearchBar } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import { SaveAddMachine } from '../components'
import { machineIdToAdd, clearMachineIdToAdd } from '../actions/query_actions'

class FindMachine extends Component {
    state = {
        machines: this.props.machines.machines,
        allMachines: this.props.machines.machines,
        query: '',
    }
    
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state
        return {
            headerLeft: <HeaderBackButton tintColor="#260204" onPress={() => navigation.goBack(null)} />,
            title: <Text>Pick Machine to Add</Text>,
            headerRight: (
                <SaveAddMachine 
                    backToLocationDetails={() => navigation.navigate('LocationDetails', {id: params.id ? params.id : null, locationName : params.locationName ? params.locationName : ''})}
                />),
        }
    }

    handleSearch = text => { 
        const formattedQuery = text.toLowerCase()
        const machines = this.state.allMachines.filter(m => m.name.toLowerCase().includes(formattedQuery))
        
        if (!machines.find(m => m.id === this.props.query.machineIdToAdd))
            this.props.clearMachineIdToAdd()
        this.setState({ query: formattedQuery, machines })
    }

    setSelected = machine => {
        this.props.machineIdToAdd(machine.id)
    }

    componentDidMount() {
        this.props.navigation.setParams({
            id: this.props.location.location.id,
            locationName: this.props.location.location.name,
        })
        
        //TODO: shouldn't have to do this here
        this.props.clearMachineIdToAdd()
    }

    render() {
        const { machineIdToAdd } = this.props.query
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
                        onPress={() => this.setSelected(machine)}
                    >
                        <ListItem 
                            title={machine.name}    
                            containerStyle={machine.id === machineIdToAdd ? {backgroundColor: 'yellow'} : {}}           
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>)
    }
}

FindMachine.propTypes = {
    machines: PropTypes.object,
    machineIdToAdd: PropTypes.func,
    query: PropTypes.object,
    clearMachineIdToAdd: PropTypes.func,
    location: PropTypes.object,
}

const mapStateToProps = ({ location, machines, query }) => ({ location, machines, query })
const mapDispatchToProps = (dispatch) => ({
    machineIdToAdd: id => dispatch(machineIdToAdd(id)),
    clearMachineIdToAdd: () => dispatch(clearMachineIdToAdd()),
})
export default connect(mapStateToProps, mapDispatchToProps)(FindMachine)