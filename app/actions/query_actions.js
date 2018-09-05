import {
    UPDATE_QUERY,
    SET_LOCATION_ID,
    UPDATE_COORDINATES,
    SET_SELECTED_MACHINE,
    SET_SELECTED_LOCATION_TYPE,
    SET_SELECTED_NUM_MACHINES,
} from './types'

export const updateQuery = payload => ({ type: UPDATE_QUERY, payload })
export const setLocationId = (id, name) => ({ type: SET_LOCATION_ID, id, name })
export const updateCurrCoordindates = (lat, lon, latDelta, lonDelta) =>  ({ type: UPDATE_COORDINATES, lat, lon, latDelta, lonDelta }) 
export const setSelectedMachine = machineId => ({ type: SET_SELECTED_MACHINE, machineId })
export const setSelectedLocationType = locationType => ({ type: SET_SELECTED_LOCATION_TYPE, locationType })
export const setSelectedNumMachines = num => ({ type: SET_SELECTED_NUM_MACHINES, num })