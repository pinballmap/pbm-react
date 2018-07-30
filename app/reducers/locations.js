import {
    FETCHING_LOCATION_TYPES,
    FETCHING_LOCATION_TYPES_SUCCESS,
    FETCHING_LOCATION_TYPES_FAILURE,
    FETCHING_LOCATIONS,
    FETCHING_LOCATIONS_SUCCESS,
    FETCHING_LOCATIONS_FAILURE,
    REFETCHING_LOCATIONS,
} from '../actions/types'

export const initialState = {
    isFetchingLocationTypes: false,
    locationTypes: [],
    isFetchingLocations: false,
    isRefetchingLocations: false,
    mapLocations: []
}

export default (state = initialState, action) => {
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
                isRefetchingLocations: false,
                mapLocations: action.locations,
            }
        case FETCHING_LOCATIONS_FAILURE:
            return {
                ...state,
                isFetchingLocations: false,
                isRefetchingLocations: false,
                mapLocations: [],
            }
        case REFETCHING_LOCATIONS:
            return {
                ...state,
                isRefetchingLocations: true,
            }
        default:
            return state
    }
}