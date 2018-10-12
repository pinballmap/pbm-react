import {
    FETCHING_LOCATION,
    FETCHING_LOCATION_SUCCESS,
    FETCHING_LOCATION_FAILURE,
} from '../actions/types'

export const initialState = {
    isFetchingLocation: false,
    location: {},
    // city: '',
    // date_last_updated: '',
    // description: '',
    // id: '',
    // last_updated_by_username: '',
    // lat: '',
    // location_machine_xrefs: [],
    // location_typ_id: '',
    // lon: '',
    // name: '',
    // operator_id: '',
    // phone: '',
    // state: '',
    // street: '',
    // website: '',
    // zip: ''
}

export default (state = initialState, action) => {
    switch (action.type) {
    case FETCHING_LOCATION: 
        return {
            ...state,
            isFetchingLocation: true,
        }
    case FETCHING_LOCATION_SUCCESS: 
        return {
            ...state,
            isFetchingLocation: false,
            location: action.location
        }
    case FETCHING_LOCATION_FAILURE:
        return {
            ...state,
            isFetchingLocations: false,
            location: {}
        }
    default:
        return state
    }
}