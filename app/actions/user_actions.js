import {
    FETCHING_LOCATION_TRACKING_ENABLED,
    FETCHING_LOCATION_TRACKING_SUCCESS,
    FETCHING_LOCATION_TRACKING_FAILURE,
    LOG_IN,
    LOG_OUT,
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

export const login = (credentials) => {
    return {
        type: LOG_IN,
        credentials,
    }
}

export const logout = () => {
    return {
        type: LOG_OUT
    }
}

export const loginLater = () => {
    return {
        type: LOGIN_LATER,
    }
}
