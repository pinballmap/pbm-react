import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { Modal, ScrollView, TextInput, TouchableOpacity, View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { SearchBar } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { 
    addMachineToLocation,
    addMachineToList,
    removeMachineFromList,
    setMachineFilter,
} from '../actions'
import { PbmButton, WarningButton, Text } from '../components'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { FlatList } from 'react-native-gesture-handler'

var DismissKeyboard = require('dismissKeyboard')

const getDisplayText = machine => (
    <Text style={{fontSize: 18}}>
        <Text style={{fontWeight: 'bold'}}>{machine.name}</Text>
        <Text>{` (${machine.manufacturer}, ${machine.year})`}</Text>
    </Text>
)

class MultiSelectRow extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.machine)
    }
  
    render() {
        return (
            <TouchableOpacity onPress={this._onPress}>
                <View style={{display: 'flex', flexDirection: 'row', padding: 8}}>
                    <Text style={{fontSize:18}}>{getDisplayText(this.props.machine)}</Text>
                    {this.props.selected ? <MaterialIcons name='cancel' size={18} color="#4b5862" style={{paddingTop:3,paddingLeft:5}} /> : null}
                </View>    
            </TouchableOpacity>
        )
    }
}
  
MultiSelectRow.propTypes = {
    onPressItem: PropTypes.func,
    machine: PropTypes.object,
    selected: PropTypes.bool,
}

class FindMachine extends React.PureComponent {
    constructor(props) {
        super(props)
        const sortedMachines =  this.props.machines.machines.sort((a, b) => {
            const machA = a.name.toUpperCase()  
            const machB = b.name.toUpperCase()
            return machA < machB ? -1 : machA === machB ? 0 : 1
        })

        this.state = {
            machines: sortedMachines,
            allMachines: sortedMachines,
            query: '',
            showModal: false,
            machine: {}, 
            condition: '',
            machineList: props.location.machineList,
        }   
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#4b5862" onPress={() => { navigation.goBack(null); DismissKeyboard(); }} />,
            title: <Text style={{color:'#000e18'}}>{`Select Machine to Add`}</Text>,
            headerStyle: {
                backgroundColor:'#f5fbff',
                ...ifIphoneX({
                    paddingTop: 30,
                    height: 60
                }, {
                    paddingTop: 0
                })               
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
        if (this.props.navigation.getParam('machineFilter')) {
            this.props.setMachineFilter(machine)
            this.props.navigation.goBack()
        }
        else {
            this.setState({ 
                showModal: true,
                machine,
            })
        }
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

    renderRow = (machine) => (
        <TouchableOpacity                           
            onPress={() => this.setSelected(machine.item)}
        >
            <View style={{padding:8}}>
                <Text style={{fontSize:18}}>{getDisplayText(machine.item)}</Text>
            </View>    
        </TouchableOpacity>
    )

    renderMultiSelectRow = (machine) => (
        <MultiSelectRow 
            machine={machine.item}
            onPressItem={this.onPressMultiSelect}
            selected={!!this.props.location.machineList.find(m => m.id === machine.item.id)}
        />
    )

    onPressMultiSelect = (machine) => {
        const selected = !!this.props.location.machineList.find(m => m.id === machine.id)

        if (selected) {
            this.props.removeMachineFromList(machine)
        } 
        else {
            this.props.addMachineToList(machine)
        }
    }

    keyExtractor = machine => `${machine.id}`

    UNSAFE_componentWillReceiveProps(props) {
        if (this.props.location.machineList.length === 0 && props.location.machineList.length > 0)
            this.props.navigation.setParams({ showDone: true})

        if (this.props.location.machineList.length > 0 && props.location.machineList.length === 0)
            this.props.navigation.setParams({ showDone: false})
    }

    render() {
        const { machineList = [] } = this.props.location
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
                {multiSelect ? 
                    <View style={{alignItems:'center',marginTop:5}}>
                        {machineList.length === 0 ? <Text>Select Machines to Add</Text> :
                            <View style={{display: 'flex', flexDirection: 'row'}}>
                                <Text>{`${machineList.length} machine${machineList.length > 1 ? 's' : ''} selected`}</Text>
                            </View>
                        }
                    </View> : null
                }
                <ScrollView keyboardDismissMode="on-drag">
                    <FlatList
                        data={this.state.machines}
                        renderItem={multiSelect ? this.renderMultiSelectRow: this.renderRow}
                        keyExtractor={this.keyExtractor}
                    />
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
    plusButton: {
        color: "#F53240",
        fontSize: 24
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
    setMachineFilter: PropTypes.func,
}

const mapStateToProps = ({ location, machines }) => ({ location, machines })
const mapDispatchToProps = (dispatch) => ({
    addMachineToLocation: (machine, condition) => dispatch(addMachineToLocation(machine, condition)),
    addMachineToList: machine => dispatch(addMachineToList(machine)),
    removeMachineFromList: machine => dispatch(removeMachineFromList(machine)),
    setMachineFilter: machine => dispatch(setMachineFilter(machine)),
})
export default connect(mapStateToProps, mapDispatchToProps)(FindMachine)