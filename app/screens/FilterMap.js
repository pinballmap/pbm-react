import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
    StyleSheet,
    View,     
} from 'react-native'
import { 
    ButtonGroup, 
    ThemeContext,
} from 'react-native-elements'
import { 
    DropDownButton, 
    HeaderBackButton, 
    Screen,
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
    setMachineFilter,
} from '../actions'
import {
    getLocationTypeName,
    getOperatorName,
    filterSelected,
} from '../selectors'

const FilterMap = ({
    updateNumMachinesSelected,
    updateViewFavoriteLocations,
    locationTypeName,
    operatorName,
    hasFilterSelected,
    query,
    navigation,
    selectedLocationTypeFilter,
    selectedOperatorTypeFilter,
    clearFilters,
    setMachineFilter,
}) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)
    
    const { machine, numMachines, viewByFavoriteLocations } = query
    const { navigate } = navigation

    const getIdx = (value) => {
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

    const getNumMachines = (idx) => {
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

    const setNumMachinesSelected = idx => {
        updateNumMachinesSelected(getNumMachines(idx))
    }

    const updateViewFavorites = idx => {
        updateViewFavoriteLocations(idx)
    }

    return(
        <Screen>
            <View style={s.pageTitle}><Text style={s.pageTitleText}>Apply Filters to the Map Results</Text></View>
            <Text style={[s.sectionTitle,s.paddingFirst]}>Only show locations with this machine:</Text>
            <DropDownButton
                title={machine && machine.machine_group_id ? `${machine.name.slice(0, machine.name.lastIndexOf('('))}-- All Versions` : machine.name ? machine.name : 'All'}
                onPress={() => {
                    navigate('FindMachine', {machineFilter: true})
                    setMachineFilter()
                }}
            /> 
            <Text style={[s.sectionTitle,s.marginTop25,s.paddingRL10]}>Limit by number of machines per location:</Text>
            <ButtonGroup style={s.border}
                onPress={setNumMachinesSelected}
                selectedIndex={getIdx(numMachines)}
                buttons={['All', '2+', '3+', '4+', '5+']}
                containerStyle={s.buttonGroupContainer}
                textStyle={s.textStyle}
                selectedButtonStyle={s.selButtonStyle}
                selectedTextStyle={s.selTextStyle}
                innerBorderStyle={s.innerBorderStyle}
            />
            <Text style={[s.sectionTitle,s.marginTop25,s.paddingRL10]}>Filter by location type:</Text>
            <DropDownButton
                title={locationTypeName}
                onPress={() => navigate('FindLocationType', {type: 'filter', setSelected: (id) => selectedLocationTypeFilter(id)})}
            /> 
            <Text style={[s.sectionTitle,s.marginTop25,s.paddingRL10]}>Filter by operator:</Text>
            <DropDownButton
                title={operatorName}
                onPress={() => navigate('FindOperator', {type: 'filter', setSelected: (id) => selectedOperatorTypeFilter(id)})}
            />
            <Text style={[s.sectionTitle,s.marginTop25,s.paddingRL10]}>Only show my Saved Locations:</Text>
            <ButtonGroup style={s.border}
                onPress={updateViewFavorites}
                selectedIndex={viewByFavoriteLocations ? 1 : 0}
                buttons={['All', 'My Favorites']}
                containerStyle={s.buttonGroupContainer}
                textStyle={s.textStyle}
                selectedButtonStyle={s.selButtonStyle}
                selectedTextStyle={s.selTextStyle}
                innerBorderStyle={s.innerBorderStyle}
            />
            {hasFilterSelected ? 
                <WarningButton
                    title={'Clear Filters'}
                    onPress={clearFilters}
                /> : null
            }  
        </Screen>
    )

}

FilterMap.navigationOptions = ({ navigation, theme }) => ({
    headerLeft: <HeaderBackButton navigation={navigation} title="Map" />,
    title: 'Filter Results',
    headerRight:<View style={{padding:6}}></View>,
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#2a211c' : '#f5fbff',
    },
    headerTintColor: theme === 'dark' ? '#9a836a' : '#4b5862'
})


const getStyles = theme => StyleSheet.create({
    pageTitle: {
        paddingVertical: 10,
        backgroundColor: theme._6a7d8a
    },
    pageTitleText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: "bold",
        color: theme._f5fbff
    },
    border: {
        borderWidth: 2,
        borderColor: theme.borderColor,
    },
    sectionTitle: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: "bold",
    },
    marginTop25: {
        marginTop: 25
    },
    paddingRL10: {
        paddingHorizontal: 10
    },
    paddingFirst: {
        paddingTop: 10,
        paddingHorizontal: 10,
    },
    textStyle: {
        color: theme.pbmText
    },
    selButtonStyle: {
        backgroundColor: theme.loading,
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
    setMachineFilter: () => dispatch(setMachineFilter()),
    updateViewFavoriteLocations: idx => dispatch(updateViewFavoriteLocations(idx))
})
export default connect(mapStateToProps, mapDispatchToProps)(FilterMap)

