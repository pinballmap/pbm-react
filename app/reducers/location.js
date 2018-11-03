import {
    FETCHING_LOCATION,
    FETCHING_LOCATION_SUCCESS,
    FETCHING_LOCATION_FAILURE,
    LOCATION_DETAILS_CONFIRMED,
    CLOSE_CONFIRM_MODAL,
    SET_SELECTED_LMX,
    MACHINE_CONDITION_UPDATED,
    MACHINE_SCORE_ADDED,
    LOCATION_MACHINE_REMOVED,
    ADDING_MACHINE_TO_LOCATION,
    MACHINE_ADDED_TO_LOCATION,
    MACHINE_ADDED_TO_LOCATION_FAILURE,
} from '../actions/types'

const moment = require('moment')

export const initialState = {
    isFetchingLocation: false,
    location: {},
    confirmModalVisible: false,
    confirmationMessage: '',
    curLmx: null,
    addingMachineToLocation: false,
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
        const location_machine_xrefs = state.location.location_machine_xrefs.map(m => {
            if (m.id === action.machine.id)
            {
                const obj = action.machine
                obj['machine_score_xrefs'] = m.machine_score_xrefs
                return obj
            }
            return m
        })

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
    case LOCATION_MACHINE_REMOVED: {
        const location_machine_xrefs = state.location.location_machine_xrefs.filter(m => m.id !== action.lmx)

        return {
            ...state,
            curLmx: null,
            location: {
                ...state.location,
                location_machine_xrefs,
            }
        }
    }
    case ADDING_MACHINE_TO_LOCATION: 
        return {
            ...state,
            addingMachineToLocation: true,
        }
    case MACHINE_ADDED_TO_LOCATION:
        return {
            ...state,
            addingMachineToLocation: false,
        }
    case MACHINE_ADDED_TO_LOCATION_FAILURE:
        return {
            ...state,
            addingMachineToLocation: false,
        }
    default:
        return state
    }
}