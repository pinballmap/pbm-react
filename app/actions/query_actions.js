import {
    UPDATE_QUERY,
    SET_LOCATION_ID,
} from './types'

export const updateQuery = payload => ({ type: UPDATE_QUERY, payload })
export const setLocationId = payload => ({ type: SET_LOCATION_ID, payload })