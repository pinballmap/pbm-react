import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
    Picker, 
    Platform,
    ScrollView, 
    StyleSheet,
    View,     
} from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import { 
    ConfirmationModal, 
    DropDownButton, 
    HeaderBackButton,
    PbmButton, 
    Text,
    WarningButton, 
} from '../components'
import { 
    setFilters,
    updateNumMachinesSelected,
    selectedLocationTypeFilter,
    selectedOperatorTypeFilter,
    clearFilters,
} from '../actions'
import {
    getLocationTypeName,
    sortedLocationTypes,
    sortedOperators,
    getOperatorName,
    filterSelected,
} from '../selectors'
import { headerStyle } from '../styles'

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
          headerLeft: <HeaderBackButton navigation={navigation} title="Map" />,
          title: 'Filter Results',
          headerStyle,
          headerTintColor: '#4b5862'
      }
  }

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
      
      const { 
          locationTypes,
          locationTypeName,
          operators,
          operatorName,
          hasFilterSelected,
      } = this.props

      const { machine, numMachines, locationType, selectedOperator } = this.props.query
    
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
                  containerStyle={{ height: 40, borderColor:'#e0ebf2', borderWidth: 2 }}
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
              {hasFilterSelected ? 
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
    operators: PropTypes.array,
    operatorName: PropTypes.string,
    updateNumMachinesSelected: PropTypes.func,
    clearFilters: PropTypes.func,
    navigation: PropTypes.object,
    selectedOperatorTypeFilter: PropTypes.func,
    selectedLocationTypeFilter: PropTypes.func,
    locationTypes: PropTypes.array,
    locationTypeName: PropTypes.string,
    hasFilterSelected: PropTypes.bool,
}

const mapStateToProps = (state) => {
    const { query } = state
    const locationTypes = sortedLocationTypes(state)
    const locationTypeName = getLocationTypeName(state)
    const operators = sortedOperators(state)
    const operatorName = getOperatorName(state)
    const hasFilterSelected = filterSelected(state)
    
    return { 
        locationTypes,
        locationTypeName,
        query, 
        operators,
        operatorName, 
        hasFilterSelected,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setFilters: (machine, location, numMachines, operator) => dispatch(setFilters(machine, location, numMachines, operator)),
    updateNumMachinesSelected: idx => dispatch(updateNumMachinesSelected(idx)), 
    selectedLocationTypeFilter: type => dispatch(selectedLocationTypeFilter(type)),
    selectedOperatorTypeFilter: operator => dispatch(selectedOperatorTypeFilter(operator)),
    clearFilters: () => dispatch(clearFilters()), 
})
export default connect(mapStateToProps, mapDispatchToProps)(FilterMap)

