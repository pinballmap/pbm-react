import {
    UPDATE_QUERY,
    SET_LOCATION_ID,
    UPDATE_COORDINATES,
    SET_FILTERS,
    CLEAR_FILTERS,
    SET_SELECTED_ACTIVITY_FILTER,
    CLEAR_ACTIVITY_FILTER,
} from './types'

export const updateQuery = payload => ({ type: UPDATE_QUERY, payload })
export const setLocationId = (id, name) => ({ type: SET_LOCATION_ID, id, name })
export const updateCurrCoordindates = (lat, lon, latDelta = 0.1, lonDelta = 0.1) =>  ({ type: UPDATE_COORDINATES, lat, lon, latDelta, lonDelta }) 

export const setFilters = (selectedMachine, selectedLocationType, numMachines = 0, selectedOperator) => ({
    type: SET_FILTERS,
    selectedMachine, 
    selectedLocationType, 
    numMachines, 
    selectedOperator,
})

export const clearFilters = () => ({ type: CLEAR_FILTERS })

export const setSelectedActivityFilter = (selectedActivity) => ({
    type: SET_SELECTED_ACTIVITY_FILTER,
    selectedActivity,
})

export const clearActivityFilter = () => ({ type: CLEAR_ACTIVITY_FILTER })