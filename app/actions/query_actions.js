import {
    UPDATE_QUERY,
    SET_LOCATION_ID,
    UPDATE_COORDINATES,
} from './types'

export const updateQuery = payload => ({ type: UPDATE_QUERY, payload })
export const setLocationId = payload => ({ type: SET_LOCATION_ID, payload })
export const updateCurrCoordindates = (lat, lon) =>  ({ type: UPDATE_COORDINATES, lat, lon }) 