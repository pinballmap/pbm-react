import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Picker, Text, View, StyleSheet, ScrollView, Platform } from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import { ConfirmationModal, DropDownButton, PbmButton, WarningButton } from '../components'
import { 
    setSelectedMachine, 
    setSelectedLocationType, 
    setSelectedNumMachines,
    setSelectedOperator,
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
        }
    }

  static navigationOptions = ({ navigation }) => {
      return {
          headerLeft: <HeaderBackButton tintColor="#260204" onPress={() => navigation.goBack(null)} title="Map" />,
          title: 'Filter Results',
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
  selectingLocationType = () => {
      this.setState({ showSelectLocationTypeModal: true, originalLocationType: this.state.selectedLocationType})
  }

  selectingOperator = () => {
      this.setState({ showSelectOperatorModal: true, originalOperator: this.state.selectedOperator})
  }

  componentWillUnmount() {
      this.props.setSelectedMachine(this.state.selectedMachine)
      this.props.setSelectedLocationType(this.state.selectedLocationType)
      const numMachines = this.getNumMachines(this.state.selectedNumMachines)
      this.props.setSelectedNumMachines(numMachines)
      this.props.setSelectedOperator(this.state.selectedOperator)
  }

  render(){
      console.log(this.state)
      const machines = [{name: 'All', id: null}].concat(this.props.machines.machines.sort((machineA, machineB) => {
          return machineA.name < machineB.name ? -1 : machineA.name === machineB.name ? 0 : 1
      }))

      const locationTypes = [{name: 'All', id: ''}].concat(this.props.locations.locationTypes.sort((locationA, locationB) => {
          return locationA.name < locationB.name ? -1 : locationA.name === locationB.name ? 0 : 1
      }))
      const locationTypeName = locationTypes.find(location => location.id === this.state.selectedLocationType).name

      const operators =  [{name: 'All', id: ''}].concat(this.props.operators.operators)
      const operatorName = operators.find(operator => operator.id === this.state.selectedOperator).name
    
      return(
          <ScrollView style={{flex: 1}}>
              <ConfirmationModal 
                  visible={this.state.showSelectLocationTypeModal}
              >
                  <ScrollView>
                      <Picker 
                          selectedValue={this.state.selectedLocationType}
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
                      onPress={() => this.setState({ showSelectLocationTypeModal: false, selectedLocationType: this.state.originalLocationType, originalLocationType: null })}
                  />
              </ConfirmationModal>
              <ConfirmationModal 
                  visible={this.state.showSelectOperatorModal}
              >
                  <ScrollView>
                      <Picker 
                          selectedValue={this.state.selectedOperator}
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
                      onPress={() => this.setState({ showSelectOperatorModal: false, selectedOperator: this.state.originalOperator, originalOperator: null })}
                  />
              </ConfirmationModal>
              <View style={s.pageTitle}><Text style={s.pageTitleText}>Apply Filters to the Map Results</Text></View>
              <Text style={[s.sectionTitle,s.padding10]}>Only show locations with this Machine:</Text>
              <Picker style={[s.border,s.whitebg]}
                  selectedValue={this.state.selectedMachine}
                  onValueChange={(itemValue) => this.setState({ selectedMachine: itemValue })}>
                  {machines.map(m => (
                      <Picker.Item label={m.name} value={m.id} key={m.id} />
                  ))}
              </Picker>
              <Text style={[s.sectionTitle,s.paddingBottom5]}>Limit by number of machines per location:</Text>
              <ButtonGroup style={s.border}
                  onPress={this.updateNumMachinesSelected}
                  selectedIndex={this.state.selectedNumMachines}
                  buttons={['All', '2+', '3+', '4+', '5+']}
                  containerStyle={{ height: 30 }}
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
                      selectedValue={this.state.selectedLocationType}
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
                      selectedValue={this.state.selectedOperator}
                      onValueChange={itemValue => this.setState({ selectedOperator: itemValue })}>
                      {operators.map(m => (
                          <Picker.Item label={m.name} value={m.id} key={m.id} />
                      ))}
                  </Picker> 
              }     
          </ScrollView>
      )
  }
}

const s = StyleSheet.create({
    pageTitle: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#260204"
    },
    pageTitleText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: "bold",
        color: "#f5fbff"
    },
    border: {
        borderWidth: 2,
        borderColor: "#D3ECFF",
    },
    sectionTitle: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: "bold",
        color: "#260204"
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
        color: '#000000',
        fontWeight: 'bold',
    },
})

FilterMap.propTypes = {
    query: PropTypes.object,
    setSelectedMachine: PropTypes.func,
    setSelectedLocationType: PropTypes.func,
    setSelectedNumMachines: PropTypes.func,
    setSelectedOperator: PropTypes.func,
    machines: PropTypes.object, 
    locations: PropTypes.object,
    operators: PropTypes.object,
}

const mapStateToProps = ({ locations, machines, query, operators }) => ({ locations, machines, query, operators })
const mapDispatchToProps = (dispatch) => ({
    setSelectedMachine: machine => dispatch(setSelectedMachine(machine)),
    setSelectedLocationType: type => dispatch(setSelectedLocationType(type)),
    setSelectedNumMachines: num => dispatch(setSelectedNumMachines(num)),
    setSelectedOperator: operator => dispatch(setSelectedOperator(operator))
})
export default connect(mapStateToProps, mapDispatchToProps)(FilterMap)

