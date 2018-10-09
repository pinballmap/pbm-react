import {
    FETCHING_LOCATION_TRACKING_ENABLED,
    FETCHING_LOCATION_TRACKING_SUCCESS,
    FETCHING_LOCATION_TRACKING_FAILURE,
    LOGGED_IN,
    LOGGED_OUT,
    LOGIN_LATER,
} from './types'

import { getCurrentLocation } from '../config/request'

export const fetchCurrentLocation = () => dispatch => {
    dispatch({type: FETCHING_LOCATION_TRACKING_ENABLED})

    return getCurrentLocation()
    .then(data => dispatch(getLocationTrackingEnabledSuccess(data)))
    .catch(err => dispatch(getLocationTrackingEnabledFailure(err)))
}
  
  
export const getLocationTrackingEnabledSuccess = (data) => {
    return {
        type: FETCHING_LOCATION_TRACKING_SUCCESS,
        lat: data.coords.latitude,
        lon: data.coords.longitude,
    }
}
  
export const getLocationTrackingEnabledFailure = () => {
    return {
        type: FETCHING_LOCATION_TRACKING_FAILURE,
    }
}

export const setLoggedIn = (status) => {
    if (status) 
        return {
            type: LOGGED_IN,
            status
        }
    else 
        return {
            type: LOGGED_OUT,
            status,
        }
}

export const loginLater = () => {
    return {
        type: LOGIN_LATER,
    }
}
