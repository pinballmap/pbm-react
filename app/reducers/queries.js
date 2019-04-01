import {
    UPDATE_COORDINATES,
    CLEAR_FILTERS,
    SET_SELECTED_ACTIVITY_FILTER,
    CLEAR_ACTIVITY_FILTER,
    FETCHING_LOCATIONS_BY_CITY_SUCCESS,
    SET_MACHINE_FILTER,
    SET_NUM_MACHINES_FILTER,
    SET_LOCATION_TYPE_FILTER,
    SET_OPERATOR_FILTER,
} from '../actions/types'

export const initialState = {
    locationName: '',
    curLat: null,
    curLon: null,
    latDelta: null,
    lonDelta: null,
    machineId: '',
    locationType: '',
    numMachines: '',
    selectedOperator: '',
    selectedActivity: '',
    machine: {},
}

export default (state = initialState, action) => {
    switch (action.type) {
    case UPDATE_COORDINATES: 
        return {
            ...state,
            curLat: action.lat,
            curLon: action.lon,
            latDelta: action.latDelta,
            lonDelta: action.lonDelta,
        }
    case SET_MACHINE_FILTER: {
        console.log(action.machine.id)
        return {
            ...state,
            machineId: action.machine.id,
            machine: action.machine,
        }
    }
    case SET_NUM_MACHINES_FILTER: 
        return {
            ...state,
            numMachines: action.numMachines,
        }
    case SET_LOCATION_TYPE_FILTER:
        return {
            ...state,
            locationType: action.locationType,
        }
    case SET_OPERATOR_FILTER: 
        return {
            ...state,
            selectedOperator: action.selectedOperator,
        }
    case CLEAR_FILTERS:
        return {
            ...state,
            machineId: '',
            locationType: '',
            numMachines: '',
            selectedOperator: '',
        }
    case SET_SELECTED_ACTIVITY_FILTER:
        return {
            ...state,
            selectedActivity: action.selectedActivity,
        }
    case CLEAR_ACTIVITY_FILTER: 
        return {
            ...state,
            selectedActivity: '',
        }
    case FETCHING_LOCATIONS_BY_CITY_SUCCESS: {
        const { locations } = action
        // Precaution if no locations in result. We are getting lat/lon from first result in array of locations.
        if (locations.length === 0 || !locations[0].lat || !locations[0].lon)
            return state

        return {
            ...state,
            curLat: Number(locations[0].lat),
            curLon: Number(locations[0].lon),
            latDelta: 0.1,
            lonDelta: 0.1,
        }
    }
    default:
        return state
    }
}