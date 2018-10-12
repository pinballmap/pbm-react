import {
    FETCHING_OPERATORS,
    FETCHING_OPERATORS_SUCCESS,
    FETCHING_OPERATORS_FAILURE,
} from './types'

import { getData } from '../config/request'

export const fetchOperators = (url) => dispatch => {
    dispatch({type: FETCHING_OPERATORS})

    return getData(url)
        .then(data => dispatch(getOperatorsSuccess(data)))
        .catch(err => dispatch(getOperatorsFailure(err)))
}
  
  
export const getOperatorsSuccess = (data) => {
    return {
        type: FETCHING_OPERATORS_SUCCESS,
        operators: data.operators,
    }
}
  
export const getOperatorsFailure = () => {
    return {
        type: FETCHING_OPERATORS_FAILURE
    }
}