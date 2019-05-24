import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
    ScrollView, 
    StyleSheet,
    View,     
} from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import { 
    DropDownButton, 
    HeaderBackButton, 
    Text,
    WarningButton, 
} from '../components'
import { 
    setFilters,
    updateNumMachinesSelected,
    updateViewFavoriteLocations,
    selectedLocationTypeFilter,
    selectedOperatorTypeFilter,
    clearFilters,
} from '../actions'
import {
    getLocationTypeName,
    getOperatorName,
    filterSelected,
} from '../selectors'
import { 
    headerStyle,
    headerTitleStyle,
} from '../styles'

class FilterMap extends Component {
  static navigationOptions = ({ navigation }) => {
      return {
          headerLeft: <HeaderBackButton navigation={navigation} title="Map" />,
          title: 'Filter Results',
          headerTitleStyle,
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

  updateViewFavorites = idx => {
      this.props.updateViewFavoriteLocations(idx)
  }

  render(){      
      const { 
          locationTypeName,
          operatorName,
          hasFilterSelected,
      } = this.props

      const { machine, numMachines, viewByFavoriteLocations } = this.props.query
      const { navigate } = this.props.navigation
    
      return(
          <ScrollView style={{flex: 1,backgroundColor:'#f5fbff'}}>
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
              <DropDownButton
                  title={locationTypeName}
                  onPress={() => navigate('FindLocationType', {type: 'filter', setSelected: (id) => this.props.selectedLocationTypeFilter(id)})}
              /> 
              <Text style={[s.sectionTitle,s.padding10]}>Filter by operator:</Text>
              <DropDownButton
                  title={operatorName}
                  onPress={() => navigate('FindOperator', {type: 'filter', setSelected: (id) => this.props.selectedOperatorTypeFilter(id)})}
              /> 
              <ButtonGroup style={s.border}
                  onPress={this.updateViewFavorites}
                  selectedIndex={viewByFavoriteLocations ? 1 : 0}
                  buttons={['All', 'My Favorites']}
                  containerStyle={{ height: 40, borderColor:'#e0ebf2', borderWidth: 2 }}
                  selectedButtonStyle={s.buttonStyle}
                  selectedTextStyle={s.textStyle}
              />
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
        paddingVertical: 10,
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
        paddingHorizontal: 10,
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
    operatorName: PropTypes.string,
    updateNumMachinesSelected: PropTypes.func,
    updateViewFavoriteLocations: PropTypes.func,
    clearFilters: PropTypes.func,
    navigation: PropTypes.object,
    selectedOperatorTypeFilter: PropTypes.func,
    selectedLocationTypeFilter: PropTypes.func,
    locationTypeName: PropTypes.string,
    hasFilterSelected: PropTypes.bool,
}

const mapStateToProps = (state) => {
    const { query } = state
    const locationTypeName = getLocationTypeName(state)
    const operatorName = getOperatorName(state)
    const hasFilterSelected = filterSelected(state)
    
    return { 
        locationTypeName,
        query, 
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
    updateViewFavoriteLocations: idx => dispatch(updateViewFavoriteLocations(idx))
})
export default connect(mapStateToProps, mapDispatchToProps)(FilterMap)

