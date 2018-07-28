import {
    FETCHING_MACHINES,
    FETCHING_MACHINES_SUCCESS,
    FETCHING_MACHINES_FAILURE,
} from '../actions/types'

export const initialState = {
    isFetchingMachines: false,
    machines: [],
}

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCHING_MACHINES: 
            return {
                ...state,
                isFetchingMachines: true,
            }
        case FETCHING_MACHINES_SUCCESS:
            return {
                ...state,
                isFetchingMachines: false,
                machines: action.machines,
            }
        case FETCHING_MACHINES_FAILURE:
            return {
                ...state,
                isFetchingMachines: false,
                machines: [],
            }
        default:
            return state
    }
}