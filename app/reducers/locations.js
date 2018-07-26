import {
    FETCHING_LOCATION_TYPES,
    FETCHING_LOCATION_TYPES_SUCCESS,
    FETCHING_LOCATION_TYPES_FAILURE,
    FETCHING_LOCATIONS,
    FETCHING_LOCATIONS_SUCCESS,
    FETCHING_LOCATIONS_FAILURE,
} from '../actions/types'

const INITIAL_STATE = {
    isFetchingLocationTypes: false,
    locationTypes: [],
    isFetchingLocations: false,
    mapLocations: []
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
        case FETCHING_LOCATIONS: 
            return {
                ...state,
                isFetchingLocations: true,
            }
        case FETCHING_LOCATIONS_SUCCESS:
            return {
                ...state,
                isFetchingLocations: false,
                mapLocations: action.locations,
            }
        case FETCHING_LOCATIONS_FAILURE:
            return {
                ...state,
                isFetchingLocations: false,
                mapLocations: [],
            }
        default:
            return state
    }
}