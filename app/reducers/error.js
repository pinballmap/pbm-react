import {
    DISPLAY_ERROR,
    CLEAR_ERROR,
} from '../actions/types'

export const initialState = {
    errorText: undefined,
}

export default (state = initialState, action) => {
    switch (action.type) {
    case DISPLAY_ERROR: 
        return {
            ...state,
            errorText: action.err,
        }
    case CLEAR_ERROR: 
        return {
            ...state,
            errorText: undefined
        }
    default: 
        return state
    }
}     