import {
    FETCHING_OPERATORS,
    FETCHING_OPERATORS_SUCCESS,
    FETCHING_OPERATORS_FAILURE,
} from '../actions/types'

export const initialState = {
    isFetchingOperators: false,
    operators: [],
}

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCHING_OPERATORS:
            return {
                ...state,
                isFetchingOperators: true,
            }
        case FETCHING_OPERATORS_SUCCESS:
            return {
                ...state,
                isFetchingOperators: false,
                operators: action.operators,
            }
        case FETCHING_OPERATORS_FAILURE:
            return {
                ...state,
                isFetchingOperators: false,
                operators: [],
            }
        default:
            return state
    }
}