import {
    FETCHING_LOCATION_TYPES,
    FETCHING_LOCATION_TYPES_SUCCESS,
    FETCHING_LOCATION_TYPES_FAILURE,
} from '../actions/types'

const INITIAL_STATE = {
    isFetchingLocationTypes: false,
    locationTypes: [],
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCHING_LOCATION_TYPES: 
            return {
                ...state,
                isFetchingLocationTypes: true,
            }
        case FETCHING_LOCATION_TYPES_SUCCESS:
            return {
                ...state,
                isFetchingLocationTypes: false,
                locationTypes: action.locationTypes,
            }
        case FETCHING_LOCATION_TYPES_FAILURE:
            return {
                ...state,
                isFetchingLocationTypes: false,
                locationTypes: [],
            }
        default:
            return state
    }
}