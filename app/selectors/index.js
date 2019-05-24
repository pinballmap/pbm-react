import { createSelector } from 'reselect'

const locationTypes = ({locations}) => locations.locationTypes

const locationType = ({query}) => query.locationType

export const getLocationTypeName = createSelector(
    [locationTypes, locationType],
    (locationTypes, locationType) => {
        const type = locationType > -1 ? locationTypes.find(location => location.id === locationType) : false
        if (type)
            return type.name
         
        return 'All'
    }
)

const operators = ({operators}) => operators.operators

const selectedOperator = ({query}) => query.selectedOperator

export const getOperatorName = createSelector(
    [operators, selectedOperator],
    (operators, selectedOperator) => {
        const operatorName = selectedOperator > -1 ? operators.find(operator => operator.id === selectedOperator) : false
        if (operatorName) 
            return operatorName.name
        
        return 'All'
    }
)

const queryState = ({query}) => query

export const filterSelected = createSelector(
    queryState,
    (query) => query.machineId !== '' || query.locationType !== '' || query.selectedOperator !== '' || query.numMachines !== 0 || query.viewByFavoriteLocations ? true : false
)

const mapLocations = ({locations}) => locations.mapLocations

const faveLocations = ({user}) => user.faveLocations

export const getMapLocations = createSelector(
    [mapLocations, faveLocations, queryState],
    (locations = [], faveLocations, query) => {
        if (query.viewByFavoriteLocations) {
            return locations.filter(loc => {
                if (faveLocations.findIndex(fave => fave.location_id === loc.id) > -1) {
                    return {
                        ...loc,
                        icon: 'heart'
                    }
                }

            })
        }
        else {
            return locations.map(loc => ({
                ...loc, 
                icon: faveLocations.findIndex(fave => fave.location_id === loc.id) > -1 ? 'heart' : 'dot'
            }))
        }
    }
)