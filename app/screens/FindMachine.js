import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { ListItem, SearchBar, Button } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import { addMachineToLocation } from '../actions/location_actions'

class FindMachine extends Component {
    state = {
        machines: this.props.machines.machines,
        allMachines: this.props.machines.machines,
        query: '',
        showModal: false,
        machineId: null, 
        machineName: '', 
    }
    
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#260204" onPress={() => navigation.goBack(null)} />,
            title: <Text>{`Select Machine to Add`}</Text>,
        }
    }

    handleSearch = text => { 
        const formattedQuery = text.toLowerCase()
        const machines = this.state.allMachines.filter(m => m.name.toLowerCase().includes(formattedQuery))
        this.setState({ query: formattedQuery, machines })
    }

    setSelected = machine => {
        this.setState({ 
            showModal: true,
            machineId: machine.id,
            machineName: machine.name, 
        })
    }

    addMachine = () => {
        this.props.addMachineToLocation(this.state.machineId)
        this.setState({ showModal: false })
        this.props.navigation.goBack()
    }

    cancelAddMachine = () => {
        this.setState({
            showModal: false,
            machineId: null,
            machineName: '',
        })
    }

    getDisplayText = machine => (
        <Text>
            <Text style={{fontWeight: 'bold'}}>{machine.name}</Text>
            <Text>{` (${machine.manufacturer}, ${machine.year})`}</Text>
        </Text>
    )

    render() {
        const sortedMachines =  this.state.machines.sort((a, b) => {
            const machA = a.name.toUpperCase()  
            const machB = b.name.toUpperCase()
            return machA < machB ? -1 : machA === machB ? 0 : 1
        })

        return (
            <View>
                <Modal
                    visible={this.state.showModal}
                >
                    <View style={{marginTop: 100}}>
                        <Text>{`Add ${this.state.machineName} to ${this.props.location.location.name}?`}</Text>
                        <Button 
                            title={'Add'}
                            onPress={this.addMachine}
                        />
                        <Button
                            title={'Cancel'}
                            onPress={this.cancelAddMachine}
                        />
                    </View>
                </Modal>
                <ScrollView>
                    <SearchBar 
                        platform='default'
                        searchIcon={false}
                        clearIcon={false}
                        onChangeText={this.handleSearch}
                    />
                    {sortedMachines.map(machine => (
                        <TouchableOpacity
                            key={machine.id}
                            onPress={() => this.setSelected(machine)}
                        >
                            <ListItem 
                                title={this.getDisplayText(machine)}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>)
    }
}

FindMachine.propTypes = {
    machines: PropTypes.object,
    addMachineToLocation: PropTypes.func,
    navigation: PropTypes.object,
    location: PropTypes.object,
}

const mapStateToProps = ({ location, machines }) => ({ location, machines })
const mapDispatchToProps = (dispatch) => ({
    addMachineToLocation: (lmx) => dispatch(addMachineToLocation(lmx)),
})
export default connect(mapStateToProps, mapDispatchToProps)(FindMachine)