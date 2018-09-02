import {
    UPDATE_QUERY,
    SET_LOCATION_ID,
    UPDATE_COORDINATES,
    SET_SELECTED_MACHINE
} from './types'

export const updateQuery = payload => ({ type: UPDATE_QUERY, payload })
export const setLocationId = (id, name) => ({ type: SET_LOCATION_ID, id, name })
export const updateCurrCoordindates = (lat, lon, latDelta, lonDelta) =>  ({ type: UPDATE_COORDINATES, lat, lon, latDelta, lonDelta }) 
export const setSelectedMachine = machineId => ({ type: SET_SELECTED_MACHINE, machineId })