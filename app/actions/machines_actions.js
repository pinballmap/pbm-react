import {
    FETCHING_MACHINES,
    FETCHING_MACHINES_SUCCESS,
    FETCHING_MACHINES_FAILURE,
} from './types'

import { getData } from '../config/request'

export const fetchMachines = (url) => dispatch => {
    dispatch({type: FETCHING_MACHINES})

    return getData(url)
        .then(data => dispatch(getMachinesSuccess(data)))
        .catch(err => dispatch(getMachinesFailure(err)))
}
  
  
export const getMachinesSuccess = (data) => {
    return {
        type: FETCHING_MACHINES_SUCCESS,
        machines: data.machines,
    }
}
  
export const getMachinesFailure = () => {
    return {
        type: FETCHING_MACHINES_FAILURE
    }
}