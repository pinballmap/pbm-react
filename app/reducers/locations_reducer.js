import {
    FETCHING_LOCATIONS,
    FETCHING_LOCATIONS_SUCCESS,
    FETCHING_LOCATIONS_FAILURE,
} from '../actions/types'

const INITIAL_STATE = {
    isFetchingLocations: false,
    locations: [],
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCHING_LOCATIONS: 
            return {
                ...state,
                isFetchingLocations: true,
            }
        case FETCHING_LOCATIONS_SUCCESS:
            return {
                ...state,
                isFetchingLocations: false,
                locations: action.locations,
            }
        case FETCHING_LOCATIONS_FAILURE:
        return {
            ...state,
            isFetchingLocations: false,
            locations: [],
        }
        default:
            return state
    }
}