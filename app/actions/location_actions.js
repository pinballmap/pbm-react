import {
    FETCHING_LOCATION,
    FETCHING_LOCATION_SUCCESS,
    FETCHING_LOCATION_FAILURE,
    LOCATION_DETAILS_CONFIRMED,
    CLOSE_CONFIRM_MODAL,
} from './types'

import { getData, putData } from '../config/request'

export const fetchLocation = id => dispatch => {
    dispatch({type: FETCHING_LOCATION})
 
    return getData(`/locations/${id}.json`)
        .then(data => dispatch(getLocationSuccess(data)))
        .catch(err => dispatch(getLocationFailure(err)))
}
  
  
export const getLocationSuccess = (data) => {
    return {
        type: FETCHING_LOCATION_SUCCESS,
        location: data,
    }
}
  
export const getLocationFailure = () => {
    return {
        type: FETCHING_LOCATION_FAILURE
    }
}

export const confirmLocationIsUpToDate = (body, id, username) => dispatch => {
    return putData(`/locations/${id}/confirm.json`, body)
        .then(data => dispatch(locationDetailsConfirmed(data.msg, username)))
        .catch(err => console.log(err))
}

const locationDetailsConfirmed = (msg, username) => {
    return {
        type: LOCATION_DETAILS_CONFIRMED,
        msg,
        username,
    }
}

export const closeConfirmModal = () => {
    return {
        type: CLOSE_CONFIRM_MODAL,
    }
}