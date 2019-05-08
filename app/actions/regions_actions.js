import {
    FETCHING_REGIONS,
    FETCHING_REGIONS_SUCCESS,
    FETCHING_REGIONS_FAILURE,
} from './types'

import { getData } from '../config/request'

export const getRegions = (url) => dispatch => {
    dispatch({type: FETCHING_REGIONS})

    return getData(url)
        .then(data => dispatch(getRegionsSuccess(data)))
        .catch(err => dispatch(getRegionsFailure(err)))
}
  
  
export const getRegionsSuccess = (data) => {
    return {
        type: FETCHING_REGIONS_SUCCESS,
        regions: data.regions,
    }
}
  
export const getRegionsFailure = () => {
    return {
        type: FETCHING_REGIONS_FAILURE
    }
}