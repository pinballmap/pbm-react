import { AsyncStorage } from 'react-native'
import {
    FETCHING_LOCATION_TRACKING_ENABLED,
    FETCHING_LOCATION_TRACKING_SUCCESS,
    FETCHING_LOCATION_TRACKING_FAILURE,
    LOG_IN,
    LOG_OUT,
    LOGIN_LATER,
    FETCHING_FAVORITE_LOCATIONS_SUCCESS,
    ADDING_FAVORITE_LOCATION,
    REMOVING_FAVORITE_LOCATION,
    FAVORITE_LOCATION_ADDED,
    FAVORITE_LOCATION_REMOVED,
    ACKNOWLEDGE_FAVORITE_UPDATE,
    SELECT_FAVORITE_LOCATION_FILTER_BY
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
    faveLocations: [],
    addingFavoriteLocation: false,
    removingFavoriteLocation: false,
    favoriteModalVisible: false,
    favoriteModalText: '',
    selectedFavoriteLocationFilter: 0,
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
            lat: 45.51322,
            lon: -122.6587,
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
    case FETCHING_FAVORITE_LOCATIONS_SUCCESS:
        return {
            ...state,
            faveLocations: action.faveLocations,
        }
    case ADDING_FAVORITE_LOCATION: 
        return {
            ...state,
            addingFavoriteLocation: true,
            favoriteModalVisible: true,
        }
    case REMOVING_FAVORITE_LOCATION:
        return {
            ...state,
            removingFavoriteLocation: true,
            favoriteModalVisible: true, 
        }
    case FAVORITE_LOCATION_ADDED:
        return {
            ...state,
            addingFavoriteLocation: false,
            favoriteModalText: 'Successfully added location to your saved list',
        }
    case FAVORITE_LOCATION_REMOVED: 
        return {
            ...state,
            removingFavoriteLocation: false,
            favoriteModalText: 'Successfully removed location from your saved list',
            faveLocations: state.faveLocations.filter(location => location.location_id !== action.id)
        }
    case ACKNOWLEDGE_FAVORITE_UPDATE: 
        return {
            ...state,
            favoriteModalVisible: false, 
            favoriteModalText: '',
        }
    case SELECT_FAVORITE_LOCATION_FILTER_BY:
        return {
            ...state,
            selectedFavoriteLocationFilter: action.idx,
        }
    default:
        return state
    }
}