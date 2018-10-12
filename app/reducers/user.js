import { AsyncStorage } from 'react-native'
import {
    FETCHING_LOCATION_TRACKING_ENABLED,
    FETCHING_LOCATION_TRACKING_SUCCESS,
    FETCHING_LOCATION_TRACKING_FAILURE,
    LOG_IN,
    LOG_OUT,
    LOGIN_LATER,
} from '../actions/types'

export const initialState = {
    isFetchingLocationTrackingEnabled: false,
    lat: null,
    lon: null,
    locationTrackingServicesEnabled: false, 
    loggedIn: false,
    loginLater: false,
    authentication_token: null,
    email: null,
    id: null,
    username: null,
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
    case LOG_IN: {
        if (!action.credentials)
            return state
                
        AsyncStorage.setItem('auth', JSON.stringify(action.credentials))
            
        return {
            ...state,
            loggedIn: true,
            authentication_token: action.credentials.authentication_token,
            email: action.credentials.email,
            id: action.credentials.id,
            username: action.credentials.username,
        }
    }
    case LOG_OUT: {
        AsyncStorage.removeItem('auth')
            
        return {
            ...state,
            loggedIn: false,
            loginLater: false,
            authentication_token: null,
            email: null,
            id: null,
            username: null,
        }
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