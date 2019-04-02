import { createSelector } from 'reselect'

const locationTypes = ({locations}) => locations.locationTypes

export const sortedLocationTypes = createSelector(
    locationTypes, 
    (locationTypes) => {
        return [{name: 'All', id: ''}].concat(locationTypes.sort((locationA, locationB) => {
            return locationA.name < locationB.name ? -1 : locationA.name === locationB.name ? 0 : 1
        }))
    }
)

const locationType = ({query}) => query.locationType

export const getLocationTypeName = createSelector(
    [locationTypes, locationType],
    (locationTypes, locationType) => {
        const type = locationTypes.find(location => location.id === locationType)
        if (type)
            return type.name
         
        return 'All'
    }
)

const operators = ({operators}) => operators.operators

export const sortedOperators = createSelector(
    operators,
    (operators) => {
        return [{name: 'All', id: ''}].concat(operators)
    }
)

const selectedOperator = ({query}) => query.selectedOperator

export const getOperatorName = createSelector(
    [operators, selectedOperator],
    (operators, selectedOperator) => {
        const operatorName = operators.find(operator => operator.id === selectedOperator)

        if (operatorName) 
            return operatorName.name
        
        return 'All'
    }
)

const queryState = ({query}) => query

export const filterSelected = createSelector(
    queryState,
    (query) => query.machineId !== '' || query.locationType !== '' || query.selectedOperator !== '' || query.numMachines !== 0 ? true : false
)