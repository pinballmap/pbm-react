import {
    FETCHING_LOCATION,
    FETCHING_LOCATION_SUCCESS,
    FETCHING_LOCATION_FAILURE,
    LOCATION_DETAILS_CONFIRMED,
    CLOSE_CONFIRM_MODAL,
    SET_SELECTED_LMX,
    MACHINE_CONDITION_UPDATED,
    MACHINE_SCORE_ADDED
} from '../actions/types'

const moment = require('moment')

export const initialState = {
    isFetchingLocation: false,
    location: {},
    confirmModalVisible: false,
    confirmationMessage: '',
    curLmx: null,
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
    case SET_SELECTED_LMX: 
        return {
            ...state,
            curLmx: action.lmx,
        }
    case MACHINE_CONDITION_UPDATED: {
        const location_machine_xrefs = state.location.location_machine_xrefs
            .map(m => m.id === action.machine.id ? action.machine : m)

        return {
            ...state,
            curLmx: action.machine,
            location: {
                ...state.location,
                location_machine_xrefs,
            }
        }
    }
    case MACHINE_SCORE_ADDED: {
        console.log(action.score)
        const machine_score_xrefs = state.curLmx.machine_score_xrefs.concat([action.score])

        const location_machine_xrefs = state.location.location_machine_xrefs.map(lmx => {
            if (lmx.id === action.score.location_machine_xref_id) {
                const machine_score_xrefs = lmx.machine_score_xrefs.concat([action.score])
                return {
                    ...lmx,
                    machine_score_xrefs,
                }
            }
            else 
                return lmx
        })

        return {
            ...state,
            curLmx: {
                ...state.curLmx,
                machine_score_xrefs,
            },
            location: {
                ...state.location,
                location_machine_xrefs,
            }
        }
    }
    default:
        return state
    }
}