import {
    FETCHING_LOCATION,
    FETCHING_LOCATION_SUCCESS,
    FETCHING_LOCATION_FAILURE,
    LOCATION_DETAILS_CONFIRMED,
    CLOSE_CONFIRM_MODAL,
} from '../actions/types'

const moment = require('moment')

export const initialState = {
    isFetchingLocation: false,
    location: {},
    confirmModalVisible: false,
    confirmationMessage: '',
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
    case LOCATION_DETAILS_CONFIRMED: 
        return {
            ...state,
            location: {
                ...state.location,
                last_updated_by_username: action.username,   
                date_last_updated: moment().format('YYYY-MM-DD'),
            },
            confirmModalVisible: true,
            confirmationMessage: action.msg,
        }
    case CLOSE_CONFIRM_MODAL: 
        return {
            ...state,
            confirmModalVisible: false,
            confirmationMessage: '',
        }
    default:
        return state
    }
}