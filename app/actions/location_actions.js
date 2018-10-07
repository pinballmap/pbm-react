import {
    FETCHING_LOCATION,
    FETCHING_LOCATION_SUCCESS,
    FETCHING_LOCATION_FAILURE,
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

export const confirmLocationIsUpToDate = (body, id) => dispatch => {
    return putData(`/locations/${id}/confirm.json`, body)
    .then(() => dispatch(fetchLocation(id)))
    .catch(err => console.log(err))
}