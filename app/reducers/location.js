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
    UPDATING_LOCATION_DETAILS,
    LOCATION_DETAILS_UPDATED,
    ADD_MACHINE_TO_LIST,
    REMOVE_MACHINE_FROM_LIST,
    CLEAR_MACHINE_LIST,
    SUGGESTING_LOCATION,
    LOCATION_SUGGESTED,
    FAILED_SUGGEST_LOCATION,
    SET_SELECTED_OPERATOR,
} from '../actions/types'

const moment = require('moment')

export const initialState = {
    isFetchingLocation: false,
    location: {},
    confirmModalVisible: false,
    confirmationMessage: '',
    curLmx: null,
    addingMachineToLocation: false,
    updatingLocationDetails: false,
    machineList: [],
    operator: null,
    isSuggestingLocation: false,
    locationSuggested: false,
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
    case UPDATING_LOCATION_DETAILS:
        return {
            ...state,
            updatingLocationDetails: true,
        }
    case LOCATION_DETAILS_UPDATED: {
        const { phone, website, description, operator_id, location_type_id } =  action.data.location
        return {
            ...state,
            updatingLocationDetails: false,
            location: {
                ...state.location,
                last_updated_by_username: action.username,   
                date_last_updated: moment().format('YYYY-MM-DD'),
                phone,
                website,
                description,
                operator_id,
                location_type_id,
            },
        }}
    case ADD_MACHINE_TO_LIST: 
        return {
            ...state,
            machineList: state.machineList.concat([action.machine]),
        }

    case REMOVE_MACHINE_FROM_LIST: {
        const { id } = action.machine
        const machineList = state.machineList.filter(m => m.id !== id)
        return {
            ...state,
            machineList,
        }
    }
    case CLEAR_MACHINE_LIST: 
        return {
            ...state,
            machineList: [],
        }
    case SUGGESTING_LOCATION:
        return {
            ...state,
            isSuggestingLocation: true,
            locationSuggested: false,
        }
    case LOCATION_SUGGESTED: 
        return {
            ...state,
            isSuggestingLocation: false,
            locationSuggested: true,
        }
    case FAILED_SUGGEST_LOCATION: 
        return {
            ...state,
            isSuggestingLocation: false,
            locationSuggested: false,
        }
    case SET_SELECTED_OPERATOR:
        return {
            ...state,
            operator: action.id,
        }
    default:
        return state
    }
}