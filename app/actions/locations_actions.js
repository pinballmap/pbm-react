import Geocode from 'react-geocode'
import { GOOGLE_MAPS_KEY } from '../config/keys'
import {
    FETCHING_LOCATION_TYPES,
    FETCHING_LOCATION_TYPES_SUCCESS,
    FETCHING_LOCATION_TYPES_FAILURE,
    FETCHING_LOCATIONS,
    FETCHING_LOCATIONS_SUCCESS,
    FETCHING_LOCATIONS_FAILURE,
    FETCHING_LOCATIONS_BY_CITY, 
    FETCHING_LOCATIONS_BY_CITY_SUCCESS,
    SELECT_LOCATION_LIST_FILTER_BY,
    DISPLAY_ERROR
} from './types'
import { 
    updateCurrCoordinates,
    updateMapCoordinates,
} from './query_actions'
import { getData } from '../config/request'

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

export const getLocations = (lat = '', lon = '', distance = global.STANDARD_DISTANCE) => (dispatch, getState) => {
    dispatch({type: FETCHING_LOCATIONS})

    const { machineId, locationType, numMachines, selectedOperator, curLat, curLon } = getState().query
    const machineQueryString = machineId ? `by_machine_id=${machineId};` : ''
    const locationTypeQueryString = locationType ? `by_type_id=${locationType};` : ''
    const numMachinesQueryString = numMachines ? `by_at_least_n_machines_type=${numMachines};` : ''
    const byOperator = selectedOperator ? `by_operator_id=${selectedOperator};` : ''
    const url = `/locations/closest_by_lat_lon.json?lat=${lat ? lat : curLat};lon=${lon ? lon : curLon};${machineQueryString}${locationTypeQueryString}${numMachinesQueryString}${byOperator}max_distance=${distance};send_all_within_distance=1`

    return getData(url)
        .then(data => dispatch(getLocationsSuccess(data)))
        .catch(err => dispatch(getLocationsFailure(err)))
}

export const getLocationsByCity = (city) => (dispatch, getState) => {
    dispatch({ type: FETCHING_LOCATIONS_BY_CITY })
   
    const { machineId, locationType, numMachines, selectedOperator } = getState().query
    const machineQueryString = machineId ? `by_machine_id=${machineId};` : ''
    const locationTypeQueryString = locationType ? `by_type_id=${locationType};` : ''
    const numMachinesQueryString = numMachines ? `by_at_least_n_machines_type=${numMachines};` : ''
    const byOperator = selectedOperator ? `by_operator_id=${selectedOperator};` : ''  
    return getData(`/locations/closest_by_address.json?address=${city};${machineQueryString}${locationTypeQueryString}${numMachinesQueryString}${byOperator}max_distance=${global.STANDARD_DISTANCE};send_all_within_distance=1`)
        .then(data => {
            if (data.locations.length > 0) {
                dispatch(getLocationsByCitySuccess(data))
            } 
            else {
                Geocode.fromAddress(city)
                    .then(response => {
                        const { lat, lng } = response.results[0].geometry.location
                        dispatch(updateCurrCoordinates(lat, lng))
                    },
                    error => {
                        console.log(error)
                        throw error
                    })
            }
        })
        .catch(err => dispatch(getLocationsFailure(err)))
}

export const getLocationsByRegion = region => (dispatch) => {
    const { lat, lon, effective_radius } = region
    
    const getDelta = () => {
        // Approximate hacks for an appropriate zoom depending on region's effective radius
        switch(true) {
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
  
export const getLocationsSuccess = (data) => {
    return {
        type: FETCHING_LOCATIONS_SUCCESS,
        locations: data.locations ? data.locations : [],
    }
}

export const getLocationsByCitySuccess = data => {
    return {
        type: FETCHING_LOCATIONS_BY_CITY_SUCCESS,
        locations: data.locations,
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


