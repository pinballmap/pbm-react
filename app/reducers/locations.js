import {
    FETCHING_LOCATION_TYPES,
    FETCHING_LOCATION_TYPES_SUCCESS,
    FETCHING_LOCATION_TYPES_FAILURE,
    FETCHING_LOCATIONS,
    FETCHING_LOCATIONS_SUCCESS,
    FETCHING_LOCATIONS_FAILURE,
    FETCHING_LOCATIONS_BY_CITY, 
    FETCHING_LOCATIONS_BY_CITY_SUCCESS,
    FETCHING_LOCATIONS_BY_CITY_FAILURE,
    REFETCHING_LOCATIONS,
    SELECT_LOCATION_LIST_FILTER_BY,
    LOCATION_DETAILS_CONFIRMED,
    LOCATION_MACHINE_REMOVED,
    MACHINE_ADDED_TO_LOCATION,
} from '../actions/types'
import { alphaSort } from '../utils/utilityFunctions'

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
    case FETCHING_LOCATIONS_BY_CITY:
        return {
            ...state,
            isFetchingLocations: true,
        }
    case FETCHING_LOCATIONS_SUCCESS:
    case FETCHING_LOCATIONS_BY_CITY_SUCCESS:
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
    case LOCATION_MACHINE_REMOVED:
    {   
        const { nameManYear, location_id } = action
        const mapLocations = state.mapLocations.map(loc => {
            if (loc.id === location_id) {
                const machine_names = loc.machine_names.filter(name => name !== nameManYear)
                return {
                    ...loc,
                    updated_at: moment.utc().format(),
                    machine_names,
                }
            }
            return loc
        })

        return {
            ...state,
            mapLocations
        }
    }
    case MACHINE_ADDED_TO_LOCATION:
    {
        const { machine, location_id } = action
        const mapLocations = state.mapLocations.map(loc => {
            if (loc.id === location_id) {
                const machine_names = alphaSort([machine.nameManYear].concat(loc.machine_names))
                return {
                    ...loc,
                    updated_at: moment.utc().format(),
                    machine_names,
                }
            }
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