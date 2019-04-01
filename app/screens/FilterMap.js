import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Picker, View, StyleSheet, ScrollView, Platform } from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import { ConfirmationModal, DropDownButton, PbmButton, WarningButton, Text } from '../components'
import { 
    setFilters,
    updateNumMachinesSelected,
    selectedLocationTypeFilter,
    selectedOperatorTypeFilter,
    clearFilters,
} from '../actions'
import { ifIphoneX } from 'react-native-iphone-x-helper'

class FilterMap extends Component {
    constructor(props){
        super(props)

        this.state ={ 
            isLoading: true,
            showSelectMachineModal: false,
            showSelectLocationTypeModal: false,
            showSelectOperatorModal: false, 
            originalOperator: null,
            selectedLocationType: null,
            originalMachine: null,
        }
    }

  static navigationOptions = ({ navigation }) => {
      return {
          headerLeft: <HeaderBackButton tintColor="#4b5862" onPress={() => navigation.goBack(null)} title="Map" />,
          title: 'Filter Results',
          headerStyle: {
              backgroundColor:'#f5fbff',
              ...ifIphoneX({
                  paddingTop: 30,
                  height: 60
              }, {
                  paddingTop: 0
              })            
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
      this.props.updateNumMachinesSelected(this.getNumMachines(idx))
  }

  selectingLocationType = () => {
      this.setState({ showSelectLocationTypeModal: true, originalLocationType: this.props.query.locationType})
  }

  selectingOperator = () => {
      this.setState({ showSelectOperatorModal: true, originalOperator: this.props.query.selectedOperator})
  }

  render(){
      const { 
          showSelectLocationTypeModal, 
          showSelectOperatorModal,
          originalLocationType,
          originalOperator,
      } = this.state
      const { machine, numMachines, locationType, selectedOperator } = this.props.query

      const locationTypes = [{name: 'All', id: ''}].concat(this.props.locations.locationTypes.sort((locationA, locationB) => {
          return locationA.name < locationB.name ? -1 : locationA.name === locationB.name ? 0 : 1
      }))
      const locationTypeName = locationTypes.find(location => location.id === locationType).name

      const operators =  [{name: 'All', id: ''}].concat(this.props.operators.operators)
      const operatorName = operators.find(operator => operator.id === selectedOperator).name
      const filterSelected = machine !== {} || locationType !== '' || selectedOperator !== '' || numMachines !== 0 ? true : false
    
      return(
          <ScrollView style={{flex: 1,backgroundColor:'#f5fbff'}}>
              <ConfirmationModal 
                  visible={showSelectLocationTypeModal}
              >
                  <ScrollView>
                      <Picker 
                          selectedValue={locationType}
                          onValueChange={selectedLocationType => this.props.selectedLocationTypeFilter(selectedLocationType)}>
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
                      onPress={() => {
                          this.setState({ showSelectLocationTypeModal: false, originalLocationType: null })
                          this.props.selectedLocationTypeFilter(originalLocationType)
                      }}
                  />
              </ConfirmationModal>
              <ConfirmationModal 
                  visible={showSelectOperatorModal}
              >
                  <ScrollView>
                      <Picker 
                          selectedValue={selectedOperator}
                          onValueChange={operator => this.props.selectedOperatorTypeFilter(operator)}>
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
                      onPress={() => {
                          this.setState({ showSelectOperatorModal: false, originalOperator: null })
                          this.props.selectedOperatorTypeFilter(originalOperator)
                      }}
                  />
              </ConfirmationModal>
              <View style={s.pageTitle}><Text style={s.pageTitleText}>Apply Filters to the Map Results</Text></View>
              <Text style={[s.sectionTitle,s.padding10]}>Only show locations with this Machine:</Text>
              <DropDownButton
                  title={machine && machine.name ? machine.name : 'All'}
                  onPress={() => this.props.navigation.navigate('FindMachine', {machineFilter: true})}
              /> 
              <Text style={[s.sectionTitle,s.paddingBottom5]}>Limit by number of machines per location:</Text>
              <ButtonGroup style={s.border}
                  onPress={this.updateNumMachinesSelected}
                  selectedIndex={this.getIdx(numMachines)}
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
                      selectedValue={locationType}
                      onValueChange={itemValue => this.props.selectedLocationTypeFilter(itemValue)}>
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
                      onValueChange={operator => this.props.selectedOperatorTypeFilter(operator)}>
                      {operators.map(m => (
                          <Picker.Item label={m.name} value={m.id} key={m.id} />
                      ))}
                  </Picker> 
              }   
              {filterSelected ? 
                  <WarningButton
                      title={'Clear Filters'}
                      onPress={() => this.props.clearFilters()}
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
    updateNumMachinesSelected: PropTypes.func,
    clearFilters: PropTypes.func,
    navigation: PropTypes.object,
    selectedOperatorTypeFilter: PropTypes.func,
    selectedLocationTypeFilter: PropTypes.func,
}

const mapStateToProps = ({ locations, machines, query, operators }) => ({ locations, machines, query, operators })
const mapDispatchToProps = (dispatch) => ({
    setFilters: (machine, location, numMachines, operator) => dispatch(setFilters(machine, location, numMachines, operator)),
    updateNumMachinesSelected: idx => dispatch(updateNumMachinesSelected(idx)), 
    selectedLocationTypeFilter: type => dispatch(selectedLocationTypeFilter(type)),
    selectedOperatorTypeFilter: operator => dispatch(selectedOperatorTypeFilter(operator)),
    clearFilters: () => dispatch(clearFilters()), 
})
export default connect(mapStateToProps, mapDispatchToProps)(FilterMap)

