import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Dimensions,
    Keyboard,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
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
    static contextType = ThemeContext

    _onPress = () => {
        this.props.onPressItem(this.props.machine)
    }

    render() {
        const { index, machine, selected } = this.props
        const theme = this.context.theme
        const backgroundColor = index % 2 === 0 ? theme.neutral : theme.white

        return (
            <Pressable
                onPress={this._onPress}
                style={({ pressed }) => [{display: 'flex', flexDirection: 'row', padding: 8},pressed ? {backgroundColor: theme.indigo2,opacity: 0.8} : {backgroundColor,opacity: 1}]}
            >
                <Text style={{ fontSize: 18 }}>{getDisplayText(machine)}</Text>
                {selected ? <MaterialIcons name='cancel' size={18} color="#766a62" style={{ paddingTop: 3, paddingLeft: 5 }} /> : null}
            </Pressable>
        )
    }
}

MultiSelectRow.propTypes = {
    onPressItem: PropTypes.func,
    machine: PropTypes.object,
    selected: PropTypes.bool,
    index: PropTypes.number,
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
            headerLeft: () => <HeaderBackButton navigation={navigation} />,
            title: navigation.getParam('machineFilter') ? 'Select Machine to Filter' : 'Select Machine to Add',
            headerRight: () =>
                navigation.getParam('showDone') ?
                    <Pressable
                        onPress={() => navigation.goBack(null)}
                    >
                        {({ pressed }) => (
                            <Text style={{ color: pressed ? '#95867c' : '#7cc5ff',fontSize: 18, fontWeight: 'bold', marginRight: 10}}>
                                Done
                            </Text>
                        )}
                    </Pressable>
                    : <View style={{ padding: 6 }}></View>,
            headerStyle: {
                backgroundColor: theme === 'dark' ? '#1d1c1d' : '#fffbf5',
                borderBottomWidth: 0,
                elevation: 0,
                shadowColor: 'transparent'
            },
            headerTintColor: theme === 'dark' ? '#fdd4d7' : '#766a62',
            headerTitleStyle: {
                textAlign: 'center',
            },
            gestureEnabled: true
        }
    }

    static contextType = ThemeContext

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

    renderRow = ({ item, index }) => {
        const theme = this.context.theme
        const backgroundColor = index % 2 === 0 ? theme.neutral : theme.neutral2
        return (
            <Pressable
                onPress={() => this.setSelected(item)}
            >
                {({ pressed }) => (
                    <View style={[{padding: 8}, pressed ? {backgroundColor: theme.indigo2,opacity: 0.8} : {backgroundColor,opacity: 1}]}>
                        <Text style={{fontSize: 18}}>{getDisplayText(item)}</Text>
                    </View>
                )}
            </Pressable>
        )
    }

    renderMultiSelectRow = ({ item, index}) => (
        <MultiSelectRow
            machine={item}
            onPressItem={this.onPressMultiSelect}
            selected={!!this.props.location.machineList.find(m => m.id === item.id)}
            index={index}
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
        const theme = this.context.theme
        const s = getStyles(theme)
        return (
            <>
                <Modal
                    visible={this.state.showModal}
                    onRequestClose={() => { }}
                    transparent={false}
                >
                    <Pressable onPress={() => { Keyboard.dismiss() }}>
                        <KeyboardAwareScrollView keyboardDismissMode="on-drag" enableResetScrollToCoords={false} keyboardShouldPersistTaps="handled" style={s.background}>
                            <View style={s.verticalAlign}>
                                <Text style={{ textAlign: 'center', marginTop: 10, marginLeft: 15, marginRight: 15, fontSize: 18 }}>{`Add ${this.state.machine.name} to ${this.props.location.location.name}?`}</Text>
                                <TextInput
                                    multiline={true}
                                    placeholder={'You can also include a machine comment...'}
                                    placeholderTextColor={theme.indigo4}
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
                    </Pressable>
                </Modal>
                <SearchBar
                    lightTheme={theme.theme !== 'dark'}
                    placeholder='Filter machines...'
                    placeholderTextColor={theme.indigo4}
                    platform='default'
                    searchIcon={<MaterialIcons name='search' size={25} color={theme.indigo4} />}
                    clearIcon={<MaterialCommunityIcons name='close-circle' size={20} color={theme.indigo4} onPress={() => this.handleSearch('')} />}
                    onChangeText={(query) => this.handleSearch(query, this.state.machinesInView)}
                    inputStyle={{ color: theme.text }}
                    value={this.state.query}
                    inputContainerStyle={s.filterInput}
                    containerStyle={{backgroundColor:theme.neutral,borderBottomWidth:0,borderTopWidth:0}}
                    autoCorrect={false}
                />
                {!multiSelect ?
                    <View style={{backgroundColor:theme.neutral}}>
                        <ButtonGroup
                            onPress={this.toggleViewMachinesInMapArea}
                            selectedIndex={selectedIdx}
                            buttons={['All Machines', 'Machines in Map Area']}
                            containerStyle={s.buttonGroupContainer}
                            textStyle={s.buttonGroupInactive}
                            selectedButtonStyle={s.selButtonStyle}
                            selectedTextStyle={s.selTextStyle}
                            innerBorderStyle={s.innerBorderStyle}
                        />
                    </View> : null
                }
                {multiSelect ?
                    <View style={s.multiSelect}>
                        {machineList.length === 0 ? <Text style={{ color: theme.text }}>0 machines selected</Text> :
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Text style={{ color: theme.text }}>{`${machineList.length} machine${machineList.length > 1 ? 's' : ''} selected`}</Text>
                            </View>
                        }
                    </View> : null
                }
                <FlatList
                    keyboardShouldPersistTaps="always"
                    data={this.state.machines}
                    renderItem={multiSelect ? this.renderMultiSelectRow : this.renderRow}
                    keyExtractor={this.keyExtractor}
                    style={{backgroundColor:theme.neutral,paddingHorizontal:5}}
                />
            </>
        )
    }
}

const getStyles = theme => StyleSheet.create({
    background: {
        backgroundColor: theme.neutral
    },
    filterInput: {
        height: 35,
        backgroundColor: theme.white,
        borderRadius: 25,
        borderColor: theme.orange3,
        borderWidth: 1,
        borderBottomWidth: 1,
        marginHorizontal: 5
    },
    textInput: {
        backgroundColor: theme.white,
        borderColor: theme.orange3,
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
        backgroundColor: theme.indigo2
    },
    buttonGroupContainer: {
        height: 40,
        marginBottom: 10,
        borderWidth: 0,
        borderRadius: 25,
        backgroundColor: theme.neutral2,
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 6,
        overflow: 'visible'
    },
    buttonGroupInactive: {
        color: theme.orange8,
        fontSize: 14,
    },
    innerBorderStyle: {
        width: 0,
    },
    selButtonStyle: {
        borderWidth: 4,
        borderColor: theme.blue1,
        backgroundColor: theme.white,
        borderRadius: 25
    },
    selTextStyle: {
        color: theme.orange8,
        fontWeight: 'bold',
    },
    pressed: {
        backgroundColor: theme.indigo2,
        opacity: 0.8
    },
    notPressed: {
        backgroundColor: 'transparent',
    }
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
