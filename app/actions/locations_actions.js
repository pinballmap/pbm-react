import {
    FETCHING_LOCATION_TYPES,
    FETCHING_LOCATION_TYPES_SUCCESS,
    FETCHING_LOCATION_TYPES_FAILURE,
    FETCHING_LOCATIONS,
    FETCHING_LOCATIONS_SUCCESS,
    FETCHING_LOCATIONS_FAILURE,
    REFETCHING_LOCATIONS
} from './types'

import { getData } from '../config/request'

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
  
export const getLocationTypeFailure = () => {
    return {
        type: FETCHING_LOCATION_TYPES_FAILURE
    }
}

export const fetchLocations = (url, isRefetch) => dispatch => {
    if (isRefetch)
        dispatch({type: REFETCHING_LOCATIONS})
    else 
        dispatch({type: FETCHING_LOCATIONS})

    return getData(url)
    .then(data => dispatch(getLocationsSuccess(data)))
    .catch(err => dispatch(getLocationsFailure(err)))
}
  
  
export const getLocationsSuccess = (data) => {
    return {
        type: FETCHING_LOCATIONS_SUCCESS,
        locations: data.locations,
    }
}
  
export const getLocationsFailure = () => {
    return {
        type: FETCHING_LOCATIONS_FAILURE
    }
}