import Geocode from 'react-geocode'
import { GOOGLE_MAPS_KEY } from '../config/keys'
import {
    FETCHING_LOCATION_TYPES,
    FETCHING_LOCATION_TYPES_SUCCESS,
    FETCHING_LOCATION_TYPES_FAILURE,
    FETCHING_LOCATIONS,
    FETCHING_LOCATIONS_SUCCESS,
    FETCHING_LOCATIONS_FAILURE,
    FETCHING_LOCATIONS_BY_CITY, 
    FETCHING_LOCATIONS_BY_CITY_SUCCESS,
    REFETCHING_LOCATIONS,
    SELECT_LOCATION_LIST_FILTER_BY,
    DISPLAY_ERROR
} from './types'
import { updateCurrCoordinates } from './query_actions'
import { getData } from '../config/request'

Geocode.setApiKey(GOOGLE_MAPS_KEY)

export const fetchLocationTypes = (url) => dispatch => {
    dispatch({type: FETCHING_LOCATION_TYPES})

    return getData(url)
        .then(data => dispatch(getLocationTypeSuccess(data)))
        .catch(err => dispatch(getLocationTypeFailure(err)))
}
  
  
export const getLocationTypeSuccess = (data) => {
    return {
        type: FETCHING_LOCATION_TYPES_SUCCESS,
        locationTypes: data.location_types,
    }
}
  
export const getLocationTypeFailure = () => ({ type: FETCHING_LOCATION_TYPES_FAILURE })

export const fetchLocations = (url, isRefetch) => dispatch => {
    if (isRefetch)
        dispatch({type: REFETCHING_LOCATIONS})
    else 
        dispatch({type: FETCHING_LOCATIONS})

    return getData(url)
        .then(data => dispatch(getLocationsSuccess(data)))
        .catch(err => dispatch(getLocationsFailure(err)))
}

export const getLocationsByCity = (city) => dispatch => {
    dispatch({ type: FETCHING_LOCATIONS_BY_CITY })

    return getData(`/locations/closest_by_address.json?address=${city};max_distance=5;send_all_within_distance=1`)
        .then(data => {
            if (data.locations.length > 0) {
                dispatch(getLocationsByCitySuccess(data))
            } 
            else {
                Geocode.fromAddress(city)
                    .then(response => {
                        const { lat, lng } = response.results[0].geometry.location
                        dispatch(fetchLocations('/locations/closest_by_lat_lon.json?lat=' + lat + ';lon=' + lng + ';send_all_within_distance=1;max_distance=5', true))
                        dispatch(updateCurrCoordinates(lat, lng))
                    },
                    error => {
                        console.log(error)
                        throw error
                    })
            }
        })
        .catch(err => dispatch(getLocationsFailure(err)))
}
  
export const getLocationsSuccess = (data) => {
    return {
        type: FETCHING_LOCATIONS_SUCCESS,
        locations: data.locations ? data.locations : [],
    }
}

export const getLocationsByCitySuccess = data => {
    return {
        type: FETCHING_LOCATIONS_BY_CITY_SUCCESS,
        locations: data.locations,
    }
}
  
export const getLocationsFailure = () => dispatch => {
    dispatch({ type: FETCHING_LOCATIONS_FAILURE })
    dispatch({ type: DISPLAY_ERROR, err: 'Unable to get locations. Please try again later.'})
}

export const selectLocationListFilterBy = idx => {
    return {
        type: SELECT_LOCATION_LIST_FILTER_BY,
        idx,
    }
}


