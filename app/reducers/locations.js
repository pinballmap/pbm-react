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
    case LOCATION_MACHINE_REMOVED:
    {   
        //Updates location list / map state when a machine is removed from a location
        //Logic is more fragile than I'd like it to be. Keep an eye out here for issues. 
        const { machine_id, location_id } = action
        const mapLocations = state.mapLocations.map(loc => {
            if (loc.id === location_id) {
                const machineIdx = loc.machine_ids.findIndex(id => id === machine_id)
                const machine_ids = loc.machine_ids.filter((_, idx) => idx !== machineIdx)
                const machine_names = loc.machine_names.filter((_, idx) => idx !== machineIdx)
                return {
                    ...loc,
                    updated_at: moment.utc().format(),
                    machine_ids,
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
        //Updates location list / map state when a machine is added to a location
        //Logic is more fragile than I'd like it to be. Keep an eye out here for issues. 
        const { machine, location_id } = action
        const machineName = `${machine.name} (${machine.manufacturer}, ${machine.year})`
        const mapLocations = state.mapLocations.map(loc => {
            if (loc.id === location_id) {
                const machine_names = alphaSort([machineName].concat(loc.machine_names))
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