import {
    FETCHING_REGIONS,
    FETCHING_REGIONS_SUCCESS,
    FETCHING_REGIONS_FAILURE,
} from '../actions/types'

export const initialState = {
    isFetchingRegions: false,
    regions: [],
}

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCHING_REGIONS:
            return {
                ...state,
                isFetchingRegions: true,
            }
        case FETCHING_REGIONS_SUCCESS:
            return {
                ...state,
                isFetchingRegions: false,
                regions: action.regions,
            }
        case FETCHING_REGIONS_FAILURE:
            return {
                ...state,
                isFetchingRegions: false,
                regions: [],
            }
        default:
            return state
    }
}