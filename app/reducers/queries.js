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
    FETCHING_LOCATION_TRACKING_SUCCESS,
    FETCHING_LOCATION_TRACKING_FAILURE,
} from '../actions/types'

export const initialState = {
    locationName: '',
    curLat: '',
    curLon: '',
    latDelta: '',
    lonDelta: '',
    machineId: '',
    locationType: '',
    numMachines: 0,
    selectedOperator: '',
    selectedActivity: '',
    machine: {},
    maxZoom: false,
}

export default (state = initialState, action) => {
    switch (action.type) {
    case UPDATE_COORDINATES: 
    case FETCHING_LOCATION_TRACKING_SUCCESS:
    case FETCHING_LOCATION_TRACKING_FAILURE:
        return {
            ...state,
            curLat: Number(action.lat),
            curLon: Number(action.lon),
            latDelta: Number(action.latDelta ? action.latDelta : 0.1),
            lonDelta: Number(action.lonDelta ? action.lonDelta : 0.1),
            maxZoom: action.maxZoom || false,
        }
    case SET_MACHINE_FILTER: {
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
            locationType: action.locationType > -1 ? action.locationType : '',
        }
    case SET_OPERATOR_FILTER: 
        return {
            ...state,
            selectedOperator: action.selectedOperator > -1 ? action.selectedOperator : '',
        }
    case CLEAR_FILTERS:
        return {
            ...state,
            machineId: '',
            locationType: '',
            numMachines: 0,
            selectedOperator: '',
            machine: {},
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
 
        return {
            ...state,
            curLat: Number(locations[0].lat),
            curLon: Number(locations[0].lon),
            latDelta: 0.1,
            lonDelta: 0.1,
            maxZoom: false,
        }
    }
    default:
        return state
    }
}