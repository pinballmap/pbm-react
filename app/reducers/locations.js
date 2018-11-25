import {
    FETCHING_LOCATION_TYPES,
    FETCHING_LOCATION_TYPES_SUCCESS,
    FETCHING_LOCATION_TYPES_FAILURE,
    FETCHING_LOCATIONS,
    FETCHING_LOCATIONS_SUCCESS,
    FETCHING_LOCATIONS_FAILURE,
    REFETCHING_LOCATIONS,
    SELECT_LOCATION_LIST_FILTER_BY,
    LOCATION_DETAILS_CONFIRMED,
} from '../actions/types'

const moment = require('moment')

export const initialState = {
    isFetchingLocationTypes: false,
    locationTypes: [],
    isFetchingLocations: false,
    isRefetchingLocations: false,
    mapLocations: [], 
    selectedLocationListFilter: 0,
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
    case SELECT_LOCATION_LIST_FILTER_BY: 
        return {
            ...state, 
            selectedLocationListFilter: action.idx,
        }
    case LOCATION_DETAILS_CONFIRMED:  
    {
        const mapLocations = state.mapLocations.map(loc => {
            if (loc.id === action.id) {
                return {
                    ...loc, 
                    updated_at: moment.utc().format()
                }
            } 
            else   
                return loc
        })
        return {
            ...state, 
            mapLocations,
        }
    }
    default:
        return state
    }
}