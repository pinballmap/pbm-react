import {
    UPDATE_COORDINATES,
    SET_FILTERS,
    CLEAR_FILTERS,
    SET_SELECTED_ACTIVITY_FILTER,
    CLEAR_ACTIVITY_FILTER,
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
    case SET_FILTERS: 
        return {
            ...state, 
            machineId: action.selectedMachine,
            locationType: action.selectedLocationType,
            numMachines: action.numMachines,
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
        
    default:
        return state
    }
}