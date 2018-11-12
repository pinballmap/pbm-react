import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { ListItem, SearchBar, Button } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import { addMachineToLocation } from '../actions/location_actions'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

class FindMachine extends Component {
    state = {
        machines: this.props.machines.machines,
        allMachines: this.props.machines.machines,
        query: '',
        showModal: false,
        machineId: null, 
        machineName: '', 
        condition: '',
    }
    
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#260204" onPress={() => navigation.goBack(null)} />,
            title: <Text>{`Select Machine to Add`}</Text>,
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
            machineId: machine.id,
            machineName: machine.name, 
        })
    }

    addMachine = () => {
        this.props.addMachineToLocation(this.state.machineId, this.state.condition)
        this.setState({ showModal: false })
        this.props.navigation.goBack()
    }

    cancelAddMachine = () => {
        this.setState({
            showModal: false,
            machineId: null,
            machineName: '',
            condition: '',
        })
    }

    getDisplayText = machine => (
        <Text style={{fontSize: 16}}>
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
                    <View style={{paddingTop: 100}}>
                        <Text style={{textAlign:'center',marginTop:10,marginLeft:15,marginRight:15,fontSize: 18}}>{`Add ${this.state.machineName} to ${this.props.location.location.name}?`}</Text>
                        <TextInput
                            multiline={true}
                            placeholder={'Machine condition...'}
                            numberOfLines={4}
                            style={s.textInput}
                            value={this.state.condition}
                            onChangeText={condition => this.setState({ condition })}
                        /> 
                        <Button 
                            title={'Add'}
                            onPress={this.addMachine}
                            raised
                            buttonStyle={s.blueButton}
                            titleStyle={s.titleStyle}
                            style={{borderRadius: 50}}
                            containerStyle={[{borderRadius:50},s.margin15]}
                        />
                        <Button
                            title={'Cancel'}
                            onPress={this.cancelAddMachine}
                            raised
                            buttonStyle={s.redButton}
                            titleStyle={{fontSize:18,color:'#f53240'}}
                            style={{borderRadius: 50}}
                            containerStyle={[{borderRadius:50},s.margin15]}                           
                        />
                    </View>
                </Modal>
                <ScrollView>
                    <SearchBar
                        round
                        lightTheme
                        placeholder='Filter machines...'
                        platform='default'
                        searchIcon={<MaterialIcons name='search' size={25} color="#888888" />}
                        clearIcon={<MaterialIcons name='clear' size={20} color="#F53240" onPress={() => this.handleSearch('')} />}
                        onChangeText={this.handleSearch}
                        inputStyle={{color:'#260204'}}
                        value={this.state.query}
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

const s = StyleSheet.create({
    blueButton: {
        backgroundColor:"#D3ECFF",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    redButton: {
        backgroundColor:"#fdd4d7",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    titleStyle: {
        color:"black",
        fontSize:18
    },
    margin15: {
        marginLeft:15,
        marginRight:15,
        marginTop:15,
        marginBottom:15
    },
    textInput: {
        backgroundColor: '#ffffff', 
        borderColor: '#888888', 
        borderWidth: 1,
        height: 150,
        marginLeft:15,
        marginRight:15, 
        marginTop: 20,
    }
})

FindMachine.propTypes = {
    machines: PropTypes.object,
    addMachineToLocation: PropTypes.func,
    navigation: PropTypes.object,
    location: PropTypes.object,
}

const mapStateToProps = ({ location, machines }) => ({ location, machines })
const mapDispatchToProps = (dispatch) => ({
    addMachineToLocation: (lmx, condition) => dispatch(addMachineToLocation(lmx, condition)),
})
export default connect(mapStateToProps, mapDispatchToProps)(FindMachine)