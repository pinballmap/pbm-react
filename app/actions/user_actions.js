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
    SELECT_FAVORITE_LOCATION_FILTER_BY,
    SUBMITTING_MESSAGE,
    MESSAGE_SUBMITTED,
    MESSAGE_SUBMISSION_FAILED,
    CLEAR_MESSAGE,
    ERROR_ADDING_FAVORITE_LOCATION,
    ERROR_REMOVING_FAVORITE_LOCATION,
    SET_UNIT_PREFERENCE,
    HIDE_NO_LOCATION_TRACKING_MODAL,
    INITIAL_FETCHING_LOCATION_TRACKING_FAILURE,
    APP_LOADED,
} from './types'
import { getCurrentLocation, getData, postData } from '../config/request'
import { updateCurrCoordinates } from './locations_actions'
import { AsyncStorage } from "react-native"

export const fetchCurrentLocation = (isInitialLoad) => dispatch => {
    dispatch({type: FETCHING_LOCATION_TRACKING_ENABLED})

    return getCurrentLocation()
        .then(data => dispatch(getLocationTrackingEnabledSuccess(data)), () => {
            let coords = {}
            if (isInitialLoad) {
                coords = dispatch(getInitialLocationTrackingEnabledFailure())
            } else {
                dispatch(getLocationTrackingEnabledFailure())
            }
            return coords
        })
        .then(({lat, lon}) => {
            if (lat) dispatch(updateCurrCoordinates(lat, lon))
            if (isInitialLoad) dispatch({type: APP_LOADED})
        })
        .catch(err => console.log(err))
}


export const getLocationTrackingEnabledSuccess = (data) => {
    return {
        type: FETCHING_LOCATION_TRACKING_SUCCESS,
        lat: data.coords.latitude,
        lon: data.coords.longitude,
    }
}

export const getInitialLocationTrackingEnabledFailure = () => {
    return {
        type: INITIAL_FETCHING_LOCATION_TRACKING_FAILURE,
        lat: 45.51322,
        lon: -122.6587,
    }
}

export const getLocationTrackingEnabledFailure = () => ({
    type: FETCHING_LOCATION_TRACKING_FAILURE,
})

export const hideNoLocationTrackingModal = () => ({
    type: HIDE_NO_LOCATION_TRACKING_MODAL
})

export const login = (credentials) => {
    return {
        type: LOG_IN,
        credentials,
    }
}

export const logout = () => {
    return {
        type: LOG_OUT
    }
}

export const loginLater = () => {
    return {
        type: LOGIN_LATER,
    }
}

export const getFavoriteLocations = id => dispatch => {
    return getData(`/users/${id}/list_fave_locations.json`)
        .then(data => dispatch(getFavoriteLocationsSuccess(data)))
        .catch(err => console.log(err))
}

export const getFavoriteLocationsSuccess = data => {
    return {
        type: FETCHING_FAVORITE_LOCATIONS_SUCCESS,
        faveLocations: data.user_fave_locations,
    }
}

export const addFavoriteLocation = location_id => (dispatch, getState) => {
    dispatch({ type: ADDING_FAVORITE_LOCATION})

    const { email, authentication_token, id } = getState().user
    const body = {
        user_email: email,
        user_token: authentication_token,
        location_id,
    }

    return postData(`/users/${id}/add_fave_location.json`, body)
        .then(() => dispatch(favoriteLocationAdded()), err => { throw err })
        .then(() => dispatch(getFavoriteLocations(id)))
        .catch(err => dispatch({ type: ERROR_ADDING_FAVORITE_LOCATION, err}))
}

export const favoriteLocationAdded = () => {
    return {
        type: FAVORITE_LOCATION_ADDED,
    }
}

export const removeFavoriteLocation = location_id => (dispatch, getState) => {
    dispatch({type: REMOVING_FAVORITE_LOCATION})

    const { email, authentication_token, id } = getState().user
    const body = {
        user_email: email,
        user_token: authentication_token,
        location_id,
    }

    return postData(`/users/${id}/remove_fave_location.json`, body)
        .then(() => dispatch(favoriteLocationRemoved(location_id)), err => { throw err })
        .catch(err => dispatch({ type: ERROR_REMOVING_FAVORITE_LOCATION, err}))
}

export const favoriteLocationRemoved = (id) => {
    return {
        type: FAVORITE_LOCATION_REMOVED,
        id,
    }
}

export const closeFavoriteLocationModal = () => {
    return {
        type: ACKNOWLEDGE_FAVORITE_UPDATE,
    }
}

export const selectFavoriteLocationFilterBy = idx => {
    return {
        type: SELECT_FAVORITE_LOCATION_FILTER_BY,
        idx,
    }
}

export const submitMessage = ({name, email, message}) => (dispatch, getState) => {
    dispatch({ type: SUBMITTING_MESSAGE })

    const { email: user_email, authentication_token, lat, lon, locationTrackingServicesEnabled } = getState().user
    const body = {
        message,
        name,
        email,
    }

    if (authentication_token) {
        body.user_token = authentication_token,
        body.user_email = user_email
    }

    if (locationTrackingServicesEnabled) {
        body.lat = lat
        body.lon = lon
    }

    return postData(`/regions/contact.json`, body)
        .then(() => dispatch(messageSubmitted()))
        .catch((err) => dispatch(messageSubmissionFailed(err)))
}

export const messageSubmitted = () => {
    return { type: MESSAGE_SUBMITTED }
}

export const clearMessage = () => ({ type: CLEAR_MESSAGE })

export const messageSubmissionFailed = (err) => {
    console.log(err)
    return { type: MESSAGE_SUBMISSION_FAILED }
}

export const setUnitPreference = (unitPreference) => {
    AsyncStorage.setItem('unitPreference', JSON.stringify(unitPreference === 1))
    return {
        type: SET_UNIT_PREFERENCE,
        unitPreference
    }
}
