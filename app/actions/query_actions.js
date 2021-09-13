import Geocode from 'react-geocode'
import {
    CLEAR_FILTERS,
    CLEAR_SEARCH_BAR_TEXT,
    SET_SEARCH_BAR_TEXT,
    SET_SELECTED_ACTIVITY_FILTER,
    CLEAR_ACTIVITY_FILTER,
    SET_MACHINE_FILTER,
    SET_NUM_MACHINES_FILTER,
    SET_VIEW_FAVORITE_LOCATIONS_FILTER,
    SET_LOCATION_TYPE_FILTER,
    SET_OPERATOR_FILTER,
    SET_MACHINE_VERSION_FILTER,
} from './types'
Geocode.setApiKey(process.env.GOOGLE_MAPS_KEY)


export const clearFilters = () => ({ type: CLEAR_FILTERS })

export const setMachineFilter = (machine) => ({ type: SET_MACHINE_FILTER, machine })
export const setMachineVersionFilter = (idx) => ({ type: SET_MACHINE_VERSION_FILTER, filterByMachineVersion: Boolean(idx)  })
export const updateNumMachinesSelected = (numMachines) => ({ type: SET_NUM_MACHINES_FILTER, numMachines })
export const updateViewFavoriteLocations = (idx) => ({ type: SET_VIEW_FAVORITE_LOCATIONS_FILTER, viewByFavoriteLocations: Boolean(idx) })
export const selectedLocationTypeFilter = (locationType) => ({ type: SET_LOCATION_TYPE_FILTER, locationType })
export const selectedOperatorTypeFilter = (selectedOperator) => ({ type: SET_OPERATOR_FILTER, selectedOperator })

export const setSelectedActivityFilter = (selectedActivity) => ({
    type: SET_SELECTED_ACTIVITY_FILTER,
    selectedActivity,
})

export const clearActivityFilter = () => ({ type: CLEAR_ACTIVITY_FILTER })

export const clearSearchBarText = () => ({ type: CLEAR_SEARCH_BAR_TEXT })
export const setSearchBarText = (searchBarText) => ({
    type: SET_SEARCH_BAR_TEXT,
    searchBarText,
})
