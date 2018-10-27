import {
    FETCHING_LOCATION_TYPES,
    FETCHING_LOCATION_TYPES_SUCCESS,
    FETCHING_LOCATION_TYPES_FAILURE,
    FETCHING_LOCATIONS,
    FETCHING_LOCATIONS_SUCCESS,
    FETCHING_LOCATIONS_FAILURE,
    REFETCHING_LOCATIONS,
    SET_SELECTED_LMX
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
  
  
export const getLocationsSuccess = (data) => {
    return {
        type: FETCHING_LOCATIONS_SUCCESS,
        locations: data.locations,
    }
}
  
export const getLocationsFailure = () => ({ type: FETCHING_LOCATIONS_FAILURE })

export const confirmLocationIsUpToDate = (body, id) => {
    return putData(`/locations/${id}/confirm.json`, body)
        .then(() => getData(`/locations/${this.id}.json`))
        .catch(err => console.log(err))
}
