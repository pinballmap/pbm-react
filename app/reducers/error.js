import {
    DISPLAY_API_ERROR,
    CLEAR_API_ERROR,
} from '../actions/types'

export const initialState = {
    errorText: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
    case DISPLAY_API_ERROR: 
        return {
            ...state,
            errorText: action.err,
        }
    case CLEAR_API_ERROR: 
        return {
            ...state,
            errorText: null
        }
    default: 
        return state
    }
}    