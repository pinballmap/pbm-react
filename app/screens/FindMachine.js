import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { Modal, ScrollView, TextInput, TouchableOpacity, View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { ListItem, SearchBar } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { 
    addMachineToLocation,
    addMachineToList,
    removeMachineFromList,
} from '../actions'
import { PbmButton, WarningButton, Text } from '../components'

var DismissKeyboard = require('dismissKeyboard')

class FindMachine extends Component {
    state = {
        machines: this.props.machines.machines,
        allMachines: this.props.machines.machines,
        query: '',
        showModal: false,
        machine: {}, 
        condition: '',
    }
    
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#4b5862" onPress={() => navigation.goBack(null)} />,
            title: <Text>{`Select Machine to Add`}</Text>,
            headerStyle: {
                backgroundColor:'#f5fbff',               
            },
            headerTintColor: '#4b5862',
            headerRight: 
                navigation.getParam('showDone') ? 
                    <TouchableOpacity onPress={() => navigation.goBack(null)}><Text style={s.titleStyle}>Done</Text></TouchableOpacity> 
                    : null,
        }
    }

    handleSearch = query => { 
        const formattedQuery = query.toLowerCase()
        const machines = this.state.allMachines.filter(m => m.name.toLowerCase().includes(formattedQuery))
        this.setState({ query, machines })
    }

    setSelected = machine => {
        this.setState({ 
            showModal: true,
            machine,
        })
    }

    addMachine = () => {
        this.props.addMachineToLocation(this.state.machine, this.state.condition)
        this.setState({ showModal: false })
        this.props.navigation.goBack()
    }

    cancelAddMachine = () => {
        this.setState({
            showModal: false,
            machine: {},
            condition: '',
        })
    }

    getDisplayText = machine => (
        <Text style={{fontSize: 16}}>
            <Text style={{fontWeight: 'bold'}}>{machine.name}</Text>
            <Text>{` (${machine.manufacturer}, ${machine.year})`}</Text>
        </Text>
    )

    UNSAFE_componentWillReceiveProps(props) {
        if (this.props.location.machineList.length === 0 && props.location.machineList.length > 0)
            this.props.navigation.setParams({ showDone: true})

        if (this.props.location.machineList.length > 0 && props.location.machineList.length === 0)
            this.props.navigation.setParams({ showDone: false})
    }

    render() {
        const { machineList = [] } = this.props.location
        const sortedMachines =  this.state.machines.sort((a, b) => {
            const machA = a.name.toUpperCase()  
            const machB = b.name.toUpperCase()
            return machA < machB ? -1 : machA === machB ? 0 : 1
        })
        const multiSelect = this.props.navigation.state.params && this.props.navigation.state.params['multiSelect'] || false

        return (
            <View style={{flex:1,backgroundColor:'#f5fbff'}}>
                <Modal
                    visible={this.state.showModal}
                    onRequestClose={()=>{}}
                    transparent={false}
                >
                    <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
                        <ScrollView style={{paddingTop: 50,backgroundColor:'#f5fbff'}}>
                            <Text style={{textAlign:'center',marginTop:10,marginLeft:15,marginRight:15,fontSize: 18}}>{`Add ${this.state.machine.name} to ${this.props.location.location.name}?`}</Text>                
                            <PbmButton 
                                title={'Add'}
                                onPress={this.addMachine}
                            />
                            <WarningButton
                                title={'Cancel'}
                                onPress={this.cancelAddMachine}                      
                            />
                            <TextInput
                                multiline={true}
                                placeholder={'You can also include a machine comment...'}
                                numberOfLines={4}
                                style={[{padding:5,height: 100},s.textInput]}
                                value={this.state.condition}
                                onChangeText={condition => this.setState({ condition })}
                                textAlignVertical='top'
                                underlineColorAndroid='transparent'
                            />
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </Modal> 
                <SearchBar
                    round
                    lightTheme
                    placeholder='Filter machines...'
                    platform='default'
                    searchIcon={<MaterialIcons name='search' size={25} color="#4b5862" />}
                    clearIcon={<MaterialIcons name='clear' size={20} color="#F53240" onPress={() => this.handleSearch('')} />}
                    onChangeText={this.handleSearch}
                    inputStyle={{color:'#000e18'}}
                    value={this.state.query}
                    inputContainerStyle={{height:35,backgroundColor:'#ffffff'}}
                    containerStyle={{backgroundColor:'#97a5af'}}
                />
                <ScrollView>
                    {sortedMachines.map(machine => {
                        const selected = machineList.find(m => m.id === machine.id)
                        return multiSelect ?
                            <TouchableOpacity
                                key={machine.id}
                                onPress={() => selected ? this.props.removeMachineFromList(machine) : this.props.addMachineToList(machine) }
                            >
                                <ListItem 
                                    title={this.getDisplayText(machine)}
                                    containerStyle={{backgroundColor:'#f5fbff'}}
                                    checkmark={selected ? <MaterialIcons name='cancel' size={15} color="#4b5862" /> : null}
                                />
                            </TouchableOpacity> :
                            <TouchableOpacity                           
                                key={machine.id}
                                onPress={() => this.setSelected(machine)}
                            >
                                <ListItem 
                                    title={this.getDisplayText(machine)}
                                    containerStyle={{backgroundColor:'#f5fbff'}}
                                />
                            </TouchableOpacity>
                    }
                    )}
                </ScrollView>
            </View>)
    }
}

const s = StyleSheet.create({
    textInput: {
        backgroundColor: '#ffffff', 
        borderColor: '#97a5af', 
        borderWidth: 2,
        height: 80,
        marginLeft:20,
        marginRight:20, 
        marginTop: 20,
        borderRadius: 5
    },
    titleStyle: {
        color: "#6a7d8a",
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10
    }, 
})

FindMachine.propTypes = {
    machines: PropTypes.object,
    addMachineToLocation: PropTypes.func,
    addMachineToList: PropTypes.func,
    removeMachineFromList: PropTypes.func,
    navigation: PropTypes.object,
    location: PropTypes.object,
    multiSelect: PropTypes.bool,
}

const mapStateToProps = ({ location, machines }) => ({ location, machines })
const mapDispatchToProps = (dispatch) => ({
    addMachineToLocation: (machine, condition) => dispatch(addMachineToLocation(machine, condition)),
    addMachineToList: machine => dispatch(addMachineToList(machine)),
    removeMachineFromList: machine => dispatch(removeMachineFromList(machine)),
})
export default connect(mapStateToProps, mapDispatchToProps)(FindMachine)