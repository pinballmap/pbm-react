import Geocode from 'react-geocode'
import { GOOGLE_MAPS_KEY } from '../config/keys'
import {
    UPDATE_COORDINATES,
    CLEAR_FILTERS,
    SET_SELECTED_ACTIVITY_FILTER,
    CLEAR_ACTIVITY_FILTER,
    SET_MACHINE_FILTER,
    SET_NUM_MACHINES_FILTER,
    SET_VIEW_FAVORITE_LOCATIONS_FILTER,
    SET_LOCATION_TYPE_FILTER,
    SET_OPERATOR_FILTER,
} from './types'
import {
    getLocations,
} from './locations_actions'
import { getDistance } from '../utils/utilityFunctions'

Geocode.setApiKey(GOOGLE_MAPS_KEY)

export const getFilterState = (filterState) => {
    const { machineId, locationType, numMachines, selectedOperator, viewByFavoriteLocations } = filterState
    const filtersNoMachines = !!machineId || !!locationType || !!selectedOperator || !!viewByFavoriteLocations
    const filteringByTwoMachines = !filtersNoMachines && numMachines === '2'
    const filterApplied = filtersNoMachines || numMachines > 0
    return filteringByTwoMachines ? 300 : filterApplied ? 500 : 200
}

export const updateMapCoordinates = (lat, lon, latDelta = 0.1, lonDelta = 0.1, distance) => (dispatch, getState) => {
    const viewableMax = getFilterState(getState().query)
    const viewableLat = getDistance(lat - 0.5 * latDelta, lon, lat + 0.5 * latDelta, lon)
    const viewableLon = getDistance(lat, lon - 0.5 * lonDelta, lat, lon + 0.5 * lonDelta)
    const viewableDist = viewableLat > viewableLon ? viewableLat : viewableLon
    const maxZoom = viewableLat > viewableMax || viewableLon > viewableMax

    dispatch({ type: UPDATE_COORDINATES, lat, lon, latDelta, lonDelta, maxZoom })
    if (distance || !maxZoom) {
        dispatch(getLocations(lat, lon, distance ? distance : viewableDist * 1.1 / 2))
    }
}

export const updateCurrCoordinates = (lat, lon, latDelta = 0.1, lonDelta = 0.1) => (dispatch) => {
    dispatch({ type: UPDATE_COORDINATES, lat, lon, latDelta, lonDelta })
    dispatch(getLocations(lat, lon))
}

export const clearFilters = () => ({ type: CLEAR_FILTERS })

export const setMachineFilter = (machine) => ({ type: SET_MACHINE_FILTER, machine })
export const updateNumMachinesSelected = (numMachines) => ({ type: SET_NUM_MACHINES_FILTER, numMachines })
export const updateViewFavoriteLocations = (idx) => ({ type: SET_VIEW_FAVORITE_LOCATIONS_FILTER, viewByFavoriteLocations: Boolean(idx) })
export const selectedLocationTypeFilter = (locationType) => ({ type: SET_LOCATION_TYPE_FILTER, locationType })
export const selectedOperatorTypeFilter = (selectedOperator) => ({ type: SET_OPERATOR_FILTER, selectedOperator })

export const setSelectedActivityFilter = (selectedActivity) => ({
    type: SET_SELECTED_ACTIVITY_FILTER,
    selectedActivity,
})

export const clearActivityFilter = () => ({ type: CLEAR_ACTIVITY_FILTER })

export const getLocationsByRegion = region => (dispatch) => {
    const { lat, lon, effective_radius } = region

    const getDelta = () => {
        // Approximate hacks for an appropriate zoom depending on region's effective radius
        switch (true) {
            case effective_radius > 301:
                return 14
            case effective_radius >= 300:
                return 8
            case effective_radius >= 250:
                return 7
            case effective_radius >= 200:
                return 5.5
            case effective_radius >= 150:
                return 4.5
            case effective_radius >= 125:
                return 4
            case effective_radius >= 100:
                return 3
            case effective_radius >= 50:
                return 1.25
            case effective_radius > 25:
                return 0.8
            default:
                return 0.5
        }
    }

    const delta = getDelta()
    dispatch(updateMapCoordinates(lat, lon, delta, delta, effective_radius))
}

