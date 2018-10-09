import {
    FETCHING_LOCATION_TRACKING_ENABLED,
    FETCHING_LOCATION_TRACKING_SUCCESS,
    FETCHING_LOCATION_TRACKING_FAILURE,
    LOGGED_IN,
    LOGGED_OUT,
    LOGIN_LATER,
} from '../actions/types'

export const initialState = {
    isFetchingLocationTrackingEnabled: false,
    lat: null,
    lon: null,
    locationTrackingServicesEnabled: false, 
    loggedIn: false,
    loginLater: false,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCHING_LOCATION_TRACKING_ENABLED: 
            return {
                ...state,
                isFetchingLocationTrackingEnabled: true,
            }
        case FETCHING_LOCATION_TRACKING_SUCCESS:
            return {
                ...state,
                isFetchingLocationTrackingEnabled: false,
                lat: action.lat,
                lon: action.lon,
                locationTrackingServicesEnabled: true,
            }
        case FETCHING_LOCATION_TRACKING_FAILURE:
            return {
                ...state,
                isFetchingLocationTrackingEnabled: false,
                lat: null,
                lon: null,
                locationTrackingServicesEnabled: false,
            }
        case LOGGED_IN:
        case LOGGED_OUT:
            return {
                ...state,
                loggedIn: action.status,
            }
        case LOGIN_LATER:
            return {
                ...state,
                loginLater: true,
            }
        default:
            return state
    }
}