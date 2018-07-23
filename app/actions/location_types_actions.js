import {
    FETCHING_LOCATION_TYPES,
    FETCHING_LOCATION_TYPES_SUCCESS,
    FETCHING_LOCATION_TYPES_FAILURE,
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