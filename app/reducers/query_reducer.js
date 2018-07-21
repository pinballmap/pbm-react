import {
    UPDATE_QUERY,
    SET_LOCATION_ID,
} from '../actions/types'

const INITIAL_STATE = {
    currQueryString: '',
    locationId: ''
}

export default (state = INITIAL_STATE, action) => {
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
        default:
            return state
    }
}