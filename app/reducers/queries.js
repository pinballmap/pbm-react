import {
    UPDATE_QUERY,
    SET_LOCATION_ID,
    UPDATE_COORDINATES,
} from '../actions/types'

export const initialState = {
    currQueryString: '',
    locationId: '', 
    curLat: null,
    curLon: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_QUERY: 
            return {
                ...state,
                currQueryString: action.payload,
            }
        case SET_LOCATION_ID:
            return {
                ...state,
                currQueryString: '', 
                locationId: action.payload
            }
        case UPDATE_COORDINATES: 
            return {
                ...state,
                curLat: action.lat,
                curLon: action.lon,
            }
        default:
            return state
    }
}