import Geocode from 'react-geocode'
import { GOOGLE_MAPS_KEY } from '../config/keys'
import {
    FETCHING_LOCATION_TYPES,
    FETCHING_LOCATION_TYPES_SUCCESS,
    FETCHING_LOCATION_TYPES_FAILURE,
    FETCHING_LOCATIONS,
    FETCHING_LOCATIONS_SUCCESS,
    FETCHING_LOCATIONS_FAILURE,
    SELECT_LOCATION_LIST_FILTER_BY,
    DISPLAY_ERROR,
    SET_MAX_ZOOM,
    UPDATE_COORDINATES,
} from './types'
import { getData } from '../config/request'
import { getDistance } from "../utils/utilityFunctions"

Geocode.setApiKey(GOOGLE_MAPS_KEY)

export const fetchLocationTypes = (url) => dispatch => {
    dispatch({type: FETCHING_LOCATION_TYPES})

    return getData(url)
        .then(data => dispatch(getLocationTypeSuccess(data)))
        .catch(err => dispatch(getLocationTypeFailure(err)))
}

export const getLocationTypeSuccess = (data) => {
    return {
        type: FETCHING_LOCATION_TYPES_SUCCESS,
        locationTypes: data.location_types,
    }
}

export const getLocationTypeFailure = () => ({ type: FETCHING_LOCATION_TYPES_FAILURE })

export const getFilterState = (filterState) => {
    const { machineId, locationType, numMachines, selectedOperator, viewByFavoriteLocations } = filterState
    const filtersNoMachines = !!machineId || !!locationType || !!selectedOperator || !!viewByFavoriteLocations
    const filteringByTwoMachines = !filtersNoMachines && numMachines === '2'
    const filterApplied = filtersNoMachines || numMachines > 0
    return filteringByTwoMachines ? 300 : filterApplied ? 500 : 200
}

export const getLocations = (lat = '', lon = '', distance = global.STANDARD_DISTANCE) => (dispatch, getState) => {
    dispatch({type: FETCHING_LOCATIONS})

    const { machineId, locationType, numMachines, selectedOperator, curLat, curLon } = getState().query
    const machineQueryString = machineId ? `by_machine_id=${machineId};` : ''
    const locationTypeQueryString = locationType ? `by_type_id=${locationType};` : ''
    const numMachinesQueryString = numMachines ? `by_at_least_n_machines_type=${numMachines};` : ''
    const byOperator = selectedOperator ? `by_operator_id=${selectedOperator};` : ''
    const url = `/locations/closest_by_lat_lon.json?lat=${lat ? lat : curLat};lon=${lon ? lon : curLon};${machineQueryString}${locationTypeQueryString}${numMachinesQueryString}${byOperator}max_distance=${distance};send_all_within_distance=1;no_details=1`

    return getData(url)
        .then(data => dispatch(getLocationsSuccess(data)))
        .catch(err => dispatch(getLocationsFailure(err)))
}

export const getLocationsConsideringZoom = (lat, lon, latDelta = 0.1, lonDelta = 0.1, distance) => (dispatch, getState) => {
    const viewableMax = getFilterState(getState().query)
    const viewableLat = getDistance(lat - 0.5 * latDelta, lon, lat + 0.5 * latDelta, lon)
    const viewableLon = getDistance(lat, lon - 0.5 * lonDelta, lat, lon + 0.5 * lonDelta)
    const viewableDist = viewableLat > viewableLon ? viewableLat : viewableLon
    const maxZoom = viewableLat > viewableMax || viewableLon > viewableMax

    dispatch({ type: SET_MAX_ZOOM, maxZoom })
    if (distance || !maxZoom) {
        dispatch(getLocations(lat, lon, distance ? distance : viewableDist * 1.1 / 2))
    }
}

export const updateCurrCoordinates = (lat, lon, latDelta = 0.1, lonDelta = 0.1) => (dispatch) => {
    dispatch({ type: UPDATE_COORDINATES, lat, lon, latDelta, lonDelta })
    dispatch(getLocations(lat, lon))
}

export const updateMapCoordinates = ({...region}) => ({
    type: UPDATE_COORDINATES,
    lat: region.latitude,
    lon: region.longitude,
    latDelta: region.latitudeDelta,
    lonDelta: region.longitudeDelta,
})


export const getLocationsSuccess = (data) => {
    return {
        type: FETCHING_LOCATIONS_SUCCESS,
        locations: data.locations ? data.locations : [],
    }
}

export const getLocationsFailure = () => dispatch => {
    dispatch({ type: FETCHING_LOCATIONS_FAILURE })
    dispatch({ type: DISPLAY_ERROR, err: 'Unable to get locations. Please try again later.'})
}

export const selectLocationListFilterBy = idx => {
    return {
        type: SELECT_LOCATION_LIST_FILTER_BY,
        idx,
    }
}

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
    dispatch({
        type: UPDATE_COORDINATES,
        lat,
        lon,
        latDelta: delta,
        lonDelta: delta
    })
    dispatch(getLocationsConsideringZoom(lat, lon, delta, delta, effective_radius))
}
