import {
    APP_LOADED,
} from '../actions/types'

export const initialState = {
    appLoading: true,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case APP_LOADED:
            return {
                ...state,
                appLoading: false,
            }
        default:
            return state
    }
}
