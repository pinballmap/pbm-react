import {
    FETCHING_LOCATION_TRACKING_ENABLED,
    FETCHING_LOCATION_TRACKING_SUCCESS,
    FETCHING_LOCATION_TRACKING_FAILURE,
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
        type: FETCHING_LOCATION_TRACKING_FAILURE
    }
}
