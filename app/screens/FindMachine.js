import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Dimensions,
    Keyboard,
    Modal,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
    ButtonGroup,
    SearchBar,
} from 'react-native-elements'
import { ThemeContext } from '../theme-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FlatList } from 'react-native-gesture-handler'
import {
    addMachineToLocation,
    addMachineToList,
    removeMachineFromList,
    setMachineFilter,
} from '../actions'
import {
    HeaderBackButton,
    PbmButton,
    Text,
    WarningButton,
} from '../components'

import { alphaSortNameObj } from '../utils/utilityFunctions'

let deviceHeight = Dimensions.get('window').height

const getDisplayText = machine => (
    <Text style={{ fontSize: 18 }}>
        <Text style={{ fontWeight: 'bold' }}>{machine.name}</Text>
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
                <View style={{ display: 'flex', flexDirection: 'row', padding: 8 }}>
                    <Text style={{ fontSize: 18 }}>{getDisplayText(this.props.machine)}</Text>
                    {this.props.selected ? <MaterialIcons name='cancel' size={18} color="#4b5862" style={{ paddingTop: 3, paddingLeft: 5 }} /> : null}
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
        const sortedMachines = alphaSortNameObj(props.machines.machines)

        this.state = {
            machines: sortedMachines,
            allMachines: sortedMachines,
            query: '',
            showModal: false,
            machine: {},
            condition: '',
            machineList: props.location.machineList,
            machinesInView: false,
        }
    }

    static navigationOptions = ({ navigation, theme }) => {
        return {
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: navigation.getParam('machineFilter') ? 'Select Machine to Filter' : 'Select Machine to Add',
            headerRight:
                navigation.getParam('showDone') ?
                    <TouchableOpacity onPress={() => navigation.goBack(null)}><Text style={{ color: "#1e9dff", fontSize: 16, fontWeight: 'bold', marginRight: 10 }}>Done</Text></TouchableOpacity>
                    : <View style={{ padding: 6 }}></View>,
            headerStyle: {
                backgroundColor: theme === 'dark' ? '#1d1c1d' : '#f5fbff',
            },
            headerTintColor: theme === 'dark' ? '#fdd4d7' : '#4b5862',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1
            },
            gesturesEnabled: true
        }
    }

    handleSearch = (query, machinesInView) => {
        const formattedQuery = query.toLowerCase()

        if (machinesInView) {
            const machinesInView = this.props.mapLocations.reduce((machines, loc) => {
                loc.machine_ids && loc.machine_ids.map(machineId => {
                    if (machines.indexOf(machineId) === -1)
                        machines.push(machineId)
                })

                return machines
            }, [])

            const curMachines = this.state.allMachines.filter(mach => machinesInView.indexOf(mach.id) > -1)
            const machines = curMachines.filter(m => m.name.toLowerCase().includes(formattedQuery))
            this.setState({ query, machines })
        }
        else {
            const machines = this.state.allMachines.filter(m => m.name.toLowerCase().includes(formattedQuery))
            this.setState({ query, machines })
        }
    }

    toggleViewMachinesInMapArea = (idx) => {
        if (idx === 0 && !!this.state.machinesInView) {
            this.handleSearch(this.state.query, false)
            this.setState({ machinesInView: false })
        }
        else if (idx === 1 && !!!this.state.machinesInView) {
            this.handleSearch(this.state.query, true)
            this.setState({ machinesInView: true })
        }
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
            <View style={{ padding: 8 }}>
                <Text style={{ fontSize: 18 }}>{getDisplayText(machine.item)}</Text>
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
            this.props.navigation.setParams({ showDone: true })

        if (this.props.location.machineList.length > 0 && props.location.machineList.length === 0)
            this.props.navigation.setParams({ showDone: false })
    }

    render() {
        const { machineList = [] } = this.props.location
        const multiSelect = this.props.navigation.state.params && this.props.navigation.state.params['multiSelect'] || false
        const selectedIdx = this.state.machinesInView ? 1 : 0

        return (
            <ThemeContext.Consumer>
                {({ theme }) => {
                    const s = getStyles(theme)
                    return (
                        <>
                            <Modal
                                visible={this.state.showModal}
                                onRequestClose={() => { }}
                                transparent={false}
                            >
                                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                                    <KeyboardAwareScrollView keyboardDismissMode="on-drag" enableResetScrollToCoords={false} keyboardShouldPersistTaps="handled" style={s.background}>
                                        <View style={s.verticalAlign}>
                                            <Text style={{ textAlign: 'center', marginTop: 10, marginLeft: 15, marginRight: 15, fontSize: 18 }}>{`Add ${this.state.machine.name} to ${this.props.location.location.name}?`}</Text>
                                            <TextInput
                                                multiline={true}
                                                placeholder={'You can also include a machine comment...'}
                                                placeholderTextColor={theme.placeholder}
                                                numberOfLines={2}
                                                style={[{ padding: 5, height: 50 }, s.textInput]}
                                                value={this.state.condition}
                                                onChangeText={condition => this.setState({ condition })}
                                                textAlignVertical='top'
                                                underlineColorAndroid='transparent'
                                            />
                                            <PbmButton
                                                title={'Add'}
                                                onPress={this.addMachine}
                                            />
                                            <WarningButton
                                                title={'Cancel'}
                                                onPress={this.cancelAddMachine}
                                            />
                                        </View>
                                    </KeyboardAwareScrollView>
                                </TouchableWithoutFeedback>
                            </Modal>
                            <SearchBar
                                lightTheme={theme.theme !== 'dark'}
                                placeholder='Filter machines...'
                                placeholderTextColor={theme.placeholder}
                                platform='default'
                                searchIcon={<MaterialIcons name='search' size={25} color={theme._97a5af} />}
                                clearIcon={<MaterialCommunityIcons name='close-circle' size={20} color={theme._97a5af} onPress={() => this.handleSearch('')} />}
                                onChangeText={(query) => this.handleSearch(query, this.state.machinesInView)}
                                inputStyle={{ color: theme.pbmText }}
                                value={this.state.query}
                                inputContainerStyle={s.filterInput}
                                containerStyle={{ backgroundColor: theme.d_493931 }}
                                autoCorrect={false}
                            />
                            {!multiSelect ?
                                <ButtonGroup
                                    onPress={this.toggleViewMachinesInMapArea}
                                    selectedIndex={selectedIdx}
                                    buttons={['All Machines', 'Machines in Map Area']}
                                    containerStyle={s.buttonGroupContainer}
                                    textStyle={s.textStyle}
                                    selectedButtonStyle={s.selButtonStyle}
                                    selectedTextStyle={s.selTextStyle}
                                    innerBorderStyle={s.innerBorderStyle}
                                /> : null
                            }
                            {multiSelect ?
                                <View style={s.multiSelect}>
                                    {machineList.length === 0 ? <Text style={{ color: "#f5fbff" }}>0 machines selected</Text> :
                                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                                            <Text style={{ color: "#f5fbff" }}>{`${machineList.length} machine${machineList.length > 1 ? 's' : ''} selected`}</Text>
                                        </View>
                                    }
                                </View> : null
                            }
                            <FlatList
                                keyboardShouldPersistTaps="always"
                                data={this.state.machines}
                                renderItem={multiSelect ? this.renderMultiSelectRow : this.renderRow}
                                keyExtractor={this.keyExtractor}
                            />
                        </>
                    )
                }}
            </ThemeContext.Consumer>
        )
    }
}

const getStyles = theme => StyleSheet.create({
    background: {
        backgroundColor: theme.backgroundColor
    },
    filterInput: {
        height: 35,
        backgroundColor: theme.findInput,
        borderRadius: 10,
        borderColor: theme.borderColor,
        borderWidth: 1
    },
    textInput: {
        backgroundColor: theme.textInput,
        borderColor: theme.borderColor,
        borderWidth: 1,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        borderRadius: 10,
    },
    verticalAlign: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: deviceHeight
    },
    multiSelect: {
        alignItems: 'center',
        padding: 5,
        backgroundColor: theme._6a7d8a
    },
    textStyle: {
        color: theme.pbmText
    },
    selButtonStyle: {
        backgroundColor: theme.selButton,
    },
    selTextStyle: {
        color: theme.pbmText,
        fontWeight: 'bold',
    },
    buttonGroupContainer: {
        height: 40,
        borderColor: theme.borderColor,
        borderWidth: 2,
        backgroundColor: theme._e0ebf2,
    },
    innerBorderStyle: {
        width: 1,
        color: theme.placeholder
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
    mapLocations: PropTypes.array,
}

const mapStateToProps = ({ location, machines, locations }) => ({
    location,
    machines,
    mapLocations: locations.mapLocations || {}
})
const mapDispatchToProps = (dispatch) => ({
    addMachineToLocation: (machine, condition) => dispatch(addMachineToLocation(machine, condition)),
    addMachineToList: machine => dispatch(addMachineToList(machine)),
    removeMachineFromList: machine => dispatch(removeMachineFromList(machine)),
    setMachineFilter: machine => dispatch(setMachineFilter(machine)),
})
export default connect(mapStateToProps, mapDispatchToProps)(FindMachine)
