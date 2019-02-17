import {
    UPDATE_QUERY,
    SET_LOCATION_ID,
    UPDATE_COORDINATES,
    SET_FILTERS,
    CLEAR_FILTERS,
} from '../actions/types'

export const initialState = {
    currQueryString: '',
    locationId: '', 
    locationName: '',
    curLat: null,
    curLon: null,
    latDelta: null,
    lonDelta: null,
    machineId: '',
    locationType: '',
    numMachines: '',
    selectedOperator: '',
}

export default (state = initialState, action) => {
    switch (action.type) {
    case UPDATE_QUERY: 
        return {
            ...state,
            currQueryString: action.payload,
        }
    case SET_LOCATION_ID:
        return {
            ...state,
            currQueryString: '', 
            locationId: action.id,
            locationName: action.name,
        }
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
    default:
        return state
    }
}