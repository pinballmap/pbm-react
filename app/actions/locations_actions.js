import {
    FETCHING_LOCATION_TYPES,
    FETCHING_LOCATION_TYPES_SUCCESS,
    FETCHING_LOCATION_TYPES_FAILURE,
    FETCHING_LOCATIONS,
    FETCHING_LOCATIONS_SUCCESS,
    FETCHING_LOCATIONS_FAILURE,
    FETCHING_LOCATIONS_BY_CITY, 
    FETCHING_LOCATIONS_BY_CITY_SUCCESS,
    REFETCHING_LOCATIONS,
    SELECT_LOCATION_LIST_FILTER_BY,
    DISPLAY_ERROR
} from './types'

import { getData, putData } from '../config/request'

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

export const fetchLocations = (url, isRefetch) => dispatch => {
    if (isRefetch)
        dispatch({type: REFETCHING_LOCATIONS})
    else 
        dispatch({type: FETCHING_LOCATIONS})

    return getData(url)
        .then(data => dispatch(getLocationsSuccess(data)))
        .catch(err => dispatch(getLocationsFailure(err)))
}

export const getLocationsByCity = (city) => dispatch => {
    dispatch({ type: FETCHING_LOCATIONS_BY_CITY })

    return getData(`/locations/closest_by_address.json?address=${city};max_distance=5;send_all_within_distance=1`)
        .then(data => dispatch(getLocationsByCitySuccess(data)))
        .catch(err => dispatch(getLocationsFailure(err)))
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


