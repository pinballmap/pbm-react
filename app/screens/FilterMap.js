import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Dimensions,
    Platform,
    StyleSheet,
    View,
} from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import { ThemeContext } from '../theme-context'
import {
    DropDownButton,
    HeaderBackButton,
    Screen,
    Text,
    WarningButton,
} from '../components'
import {
    updateNumMachinesSelected,
    updateViewFavoriteLocations,
    selectedLocationTypeFilter,
    selectedOperatorTypeFilter,
    clearFilters,
    setMachineFilter,
    setMachineVersionFilter,
} from '../actions'
import {
    getLocationTypeName,
    getOperatorName,
    filterSelected,
} from '../selectors'

let deviceWidth = Dimensions.get('window').width

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
    setMachineVersionFilter,
}) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    const { machine, numMachines, viewByFavoriteLocations, filterByMachineVersion } = query
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

    const setFilterByMachineVersion = idx => {
        setMachineVersionFilter(idx)
    }

    return (
        <Screen style={{marginHorizontal:5}}>
            <Text style={[s.sectionTitle, s.paddingFirst]}>Only show locations with this machine:</Text>
            <DropDownButton
                title={machine && machine.name ? machine.name : 'All'}
                onPress={() => {
                    navigate('FindMachine', { machineFilter: true })
                    setMachineFilter()
                }}
            />
            {machine && machine.machine_group_id &&
                <>
                    <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>Machine Version:</Text>
                    <ButtonGroup
                        onPress={setFilterByMachineVersion}
                        selectedIndex={filterByMachineVersion ? 1 : 0}
                        buttons={['All Versions', 'Selected Version']}
                        containerStyle={s.buttonGroupContainer}
                        textStyle={s.buttonGroupInactive}
                        selectedButtonStyle={s.selButtonStyle}
                        selectedTextStyle={s.selTextStyle}
                        innerBorderStyle={s.innerBorderStyle}
                    />
                </>
            }
            <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>Limit by number of machines per location:</Text>
            <ButtonGroup
                onPress={setNumMachinesSelected}
                selectedIndex={getIdx(numMachines)}
                buttons={['All', '2+', '3+', '4+', '5+']}
                containerStyle={s.buttonGroupContainer}
                textStyle={s.buttonGroupInactive}
                selectedButtonStyle={s.selButtonStyle}
                selectedTextStyle={s.selTextStyle}
                innerBorderStyle={s.innerBorderStyle}
            />
            <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>Filter by location type:</Text>
            <DropDownButton
                title={locationTypeName}
                onPress={() => navigate('FindLocationType', { type: 'filter', setSelected: (id) => selectedLocationTypeFilter(id) })}
            />
            <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>Filter by operator:</Text>
            <DropDownButton
                title={operatorName}
                onPress={() => navigate('FindOperator', { type: 'filter', setSelected: (id) => selectedOperatorTypeFilter(id) })}
            />
            <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>Only show my Saved Locations:</Text>
            <ButtonGroup
                onPress={updateViewFavorites}
                selectedIndex={viewByFavoriteLocations ? 1 : 0}
                buttons={['All', 'My Favorites']}
                containerStyle={s.buttonGroupContainer}
                textStyle={s.buttonGroupInactive}
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
    title: 'Apply Filters to the Map',
    headerRight:<View style={{padding:6}}></View>,
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#1d1c1d' : '#fffbf5',
        borderBottomWidth: 0,
        elevation: 0
    },
    headerTintColor: theme === 'dark' ? '#fdd4d7' : '#766a62',
    headerTitleStyle: {
        textAlign: 'center',
        width: deviceWidth - 100,
        ...Platform.select({
            android: { flex: 1 }
        }),
    },
    gesturesEnabled: true
})


const getStyles = theme => StyleSheet.create({
    border: {
        borderWidth: 2,
        borderColor: theme.orange3,
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
    buttonGroupContainer: {
        height: 40,
        borderWidth: 0,
        borderRadius: 25,
        backgroundColor: theme.neutral2,
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 5,
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
    setMachineFilter: PropTypes.func,
    setMachineVersionFilter: PropTypes.func,
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
    updateNumMachinesSelected: idx => dispatch(updateNumMachinesSelected(idx)),
    selectedLocationTypeFilter: type => dispatch(selectedLocationTypeFilter(type)),
    selectedOperatorTypeFilter: operator => dispatch(selectedOperatorTypeFilter(operator)),
    clearFilters: () => dispatch(clearFilters()),
    setMachineFilter: () => dispatch(setMachineFilter()),
    updateViewFavoriteLocations: idx => dispatch(updateViewFavoriteLocations(idx)),
    setMachineVersionFilter: idx => dispatch(setMachineVersionFilter(idx)),
})
export default connect(mapStateToProps, mapDispatchToProps)(FilterMap)

