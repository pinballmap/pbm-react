import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Picker, View, StyleSheet, ScrollView, Platform } from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import { ConfirmationModal, DropDownButton, PbmButton, WarningButton, Text } from '../components'
import { 
    setFilters,
} from '../actions'

class FilterMap extends Component {
    constructor(props){
        super(props)

        const { machineId, locationType, selectedOperator, numMachines } = this.props.query
        this.state ={ 
            isLoading: true,
            selectedMachine: machineId,
            selectedLocationType: locationType,
            selectedOperator,
            selectedNumMachines: this.getIdx(numMachines),
            showSelectMachineModal: false,
            showSelectLocationTypeModal: false,
            showSelectOperatorModal: false, 
            originalOperator: null,
            originalLocationType: null,
            originalMachine: null,
        }
    }

  static navigationOptions = ({ navigation }) => {
      return {
          headerLeft: <HeaderBackButton tintColor="#4b5862" onPress={() => navigation.goBack(null)} title="Map" />,
          title: 'Filter Results',
          headerStyle: {
            backgroundColor:'#f5fbff',            
        },
        headerTintColor: '#4b5862'
      }
  };

  getIdx = (value) => {
      switch (value) {
      case '2':
          return 1
      case '3':
          return 2
      case '4':
          return 3
      case '5':
          return 4
      default: 
          return 0
      }
  }

  getNumMachines = (idx) => {
      switch (idx) {
      case 1:
          return '2'
      case 2: 
          return '3'
      case 3:
          return '4'
      case 4:
          return '5'
      default: 
          return ''
      }
  }

  updateNumMachinesSelected = idx => {
      this.setState({ selectedNumMachines: idx })
  }
  
  selectingMachine = () => {
      this.setState({ showSelectMachineModal: true, originalMachine: this.state.selectedMachine })
  }

  selectingLocationType = () => {
      this.setState({ showSelectLocationTypeModal: true, originalLocationType: this.state.selectedLocationType})
  }

  selectingOperator = () => {
      this.setState({ showSelectOperatorModal: true, originalOperator: this.state.selectedOperator})
  }

  clearFilters = () => {
      this.setState({
          selectedMachine: '',
          selectedLocationType: '',
          selectedOperator: '',
          selectedNumMachines: 0,
      })
  }

  componentWillUnmount() {
      const { selectedMachine, selectedLocationType, selectedNumMachines, selectedOperator} = this.state
      const numMachines = this.getNumMachines(selectedNumMachines)
      this.props.setFilters(selectedMachine, selectedLocationType, numMachines, selectedOperator)
  }

  render(){
      const { 
          selectedMachine, 
          selectedLocationType, 
          selectedOperator, 
          selectedNumMachines, 
          showSelectMachineModal, 
          showSelectLocationTypeModal, 
          showSelectOperatorModal,
          originalMachine,
          originalLocationType,
          originalOperator,
      } = this.state
      const machines = [{name: 'All', id: ''}].concat(this.props.machines.machines.sort((machineA, machineB) => {
          return machineA.name < machineB.name ? -1 : machineA.name === machineB.name ? 0 : 1
      }))
      const machineName = machines.find(machine => machine.id === selectedMachine).name

      const locationTypes = [{name: 'All', id: ''}].concat(this.props.locations.locationTypes.sort((locationA, locationB) => {
          return locationA.name < locationB.name ? -1 : locationA.name === locationB.name ? 0 : 1
      }))
      const locationTypeName = locationTypes.find(location => location.id === selectedLocationType).name

      const operators =  [{name: 'All', id: ''}].concat(this.props.operators.operators)
      const operatorName = operators.find(operator => operator.id === selectedOperator).name

      const filterSelected = selectedMachine !== '' || selectedLocationType !== '' || selectedOperator !== '' || selectedNumMachines !== 0 ? true : false
    
      return(
          <ScrollView style={{flex: 1,backgroundColor:'#f5fbff'}}>
              <ConfirmationModal 
                  visible={showSelectMachineModal}
              >
                  <ScrollView>
                      <Picker 
                          selectedValue={selectedMachine}
                          onValueChange={itemValue => this.setState({ selectedMachine: itemValue })}>
                          {machines.map(m => (
                              <Picker.Item label={m.name} value={m.id} key={m.id} />
                          ))}
                      </Picker>
                  </ScrollView>
                  <PbmButton
                      title={'OK'}
                      onPress={() => this.setState({ showSelectMachineModal: false, originalMachine: null })}
                  />
                  <WarningButton 
                      title={'Cancel'}
                      onPress={() => this.setState({ showSelectMachineModal: false, selectedMachine: originalMachine, originalMachine: null })}
                  />
              </ConfirmationModal>
              <ConfirmationModal 
                  visible={showSelectLocationTypeModal}
              >
                  <ScrollView>
                      <Picker 
                          selectedValue={selectedLocationType}
                          onValueChange={itemValue => this.setState({ selectedLocationType: itemValue })}>
                          {locationTypes.map(m => (
                              <Picker.Item label={m.name} value={m.id} key={m.id} />
                          ))}
                      </Picker>
                  </ScrollView>
                  <PbmButton
                      title={'OK'}
                      onPress={() => this.setState({ showSelectLocationTypeModal: false, originalLocationType: null })}
                  />
                  <WarningButton 
                      title={'Cancel'}
                      onPress={() => this.setState({ showSelectLocationTypeModal: false, selectedLocationType: originalLocationType, originalLocationType: null })}
                  />
              </ConfirmationModal>
              <ConfirmationModal 
                  visible={showSelectOperatorModal}
              >
                  <ScrollView>
                      <Picker 
                          selectedValue={selectedOperator}
                          onValueChange={itemValue => this.setState({ selectedOperator: itemValue })}>
                          {operators.map(m => (
                              <Picker.Item label={m.name} value={m.id} key={m.id} />
                          ))}
                      </Picker>
                  </ScrollView>
                  <PbmButton
                      title={'OK'}
                      onPress={() => this.setState({ showSelectOperatorModal: false, originalOperator: null })}
                  />
                  <WarningButton 
                      title={'Cancel'}
                      onPress={() => this.setState({ showSelectOperatorModal: false, selectedOperator: originalOperator, originalOperator: null })}
                  />
              </ConfirmationModal>
              <View style={s.pageTitle}><Text style={s.pageTitleText}>Apply Filters to the Map Results</Text></View>
              <Text style={[s.sectionTitle,s.padding10]}>Only show locations with this Machine:</Text>
              {Platform.OS === "ios" ? 
                  <DropDownButton
                      title={machineName}
                      onPress={() => this.selectingMachine()}
                  /> : 
                  <Picker style={[s.border,s.whitebg]}
                      selectedValue={selectedMachine}
                      onValueChange={(itemValue) => this.setState({ selectedMachine: itemValue })}>
                      {machines.map(m => (
                          <Picker.Item label={m.name} value={m.id} key={m.id} />
                      ))}
                  </Picker>
              }
              <Text style={[s.sectionTitle,s.paddingBottom5]}>Limit by number of machines per location:</Text>
              <ButtonGroup style={s.border}
                  onPress={this.updateNumMachinesSelected}
                  selectedIndex={selectedNumMachines}
                  buttons={['All', '2+', '3+', '4+', '5+']}
                  containerStyle={{ height: 40, borderColor:'#97a5af', borderWidth: 2 }}
                  selectedButtonStyle={s.buttonStyle}
                  selectedTextStyle={s.textStyle}
              />
              <Text style={[s.sectionTitle,s.padding10]}>Filter by location type:</Text>
              {Platform.OS === "ios" ? 
                  <DropDownButton
                      title={locationTypeName}
                      onPress={() => this.selectingLocationType()}
                  /> : 
                  <Picker style={[s.border,s.whitebg]}
                      selectedValue={selectedLocationType}
                      onValueChange={itemValue => this.setState({ selectedLocationType: itemValue })}>
                      {locationTypes.map(m => (
                          <Picker.Item label={m.name} value={m.id} key={m.id} />
                      ))}
                  </Picker>
              }
              <Text style={[s.sectionTitle,s.padding10]}>Filter by operator:</Text>
              {Platform.OS === "ios" ? 
                  <DropDownButton
                      title={operatorName}
                      onPress={() => this.selectingOperator()}
                  /> : 
                  <Picker 
                      style={[s.border,s.whitebg]}
                      selectedValue={selectedOperator}
                      onValueChange={itemValue => this.setState({ selectedOperator: itemValue })}>
                      {operators.map(m => (
                          <Picker.Item label={m.name} value={m.id} key={m.id} />
                      ))}
                  </Picker> 
              }   
              {filterSelected ? 
                  <WarningButton
                      title={'Clear Filters'}
                      onPress={() => this.clearFilters()}
                  /> : null
              }  
          </ScrollView>
      )
  }
}

const s = StyleSheet.create({
    pageTitle: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#6a7d8a"
    },
    pageTitleText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: "bold",
        color: "#f5fbff"
    },
    border: {
        borderWidth: 2,
        borderColor: "#97a5af",
    },
    sectionTitle: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: "bold",
        color: "#000e18"
    },
    padding10: {
        padding: 10
    },
    paddingBottom5: {
        paddingBottom: 5,
        paddingTop: 10,
        paddingRight: 10,
        paddingLeft: 10
    },
    whitebg: {
        backgroundColor: "#FFFFFF",
        marginLeft: 10,
        marginRight: 10
    },
    buttonStyle: {
        backgroundColor: '#D3ECFF',
    },
    textStyle: {
        color: '#000e18',
        fontWeight: 'bold',
    },
})

FilterMap.propTypes = {
    query: PropTypes.object,
    setFilters: PropTypes.func,
    machines: PropTypes.object, 
    locations: PropTypes.object,
    operators: PropTypes.object,
}

const mapStateToProps = ({ locations, machines, query, operators }) => ({ locations, machines, query, operators })
const mapDispatchToProps = (dispatch) => ({
    setFilters: (machine, location, numMachines, operator) => dispatch(setFilters(machine, location, numMachines, operator))
})
export default connect(mapStateToProps, mapDispatchToProps)(FilterMap)

