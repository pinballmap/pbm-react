import {
    FETCHING_LOCATIONS,
    FETCHING_LOCATIONS_SUCCESS,
    FETCHING_LOCATIONS_FAILURE,
} from './types'

import { getData } from '../config/request'

export const fetchLocations = (url) => dispatch => {
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