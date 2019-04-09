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
    DISPLAY_ERROR,
    UPDATING_LOCATION_DETAILS,
    LOCATION_DETAILS_UPDATED,
    FAILED_LOCATION_DETAILS_UPDATE,
    ADD_MACHINE_TO_LIST,
    REMOVE_MACHINE_FROM_LIST,
    CLEAR_MACHINE_LIST,
    SUGGESTING_LOCATION,
    LOCATION_SUGGESTED,
    FAILED_SUGGEST_LOCATION,
} from './types'

import { getData, postData, putData, deleteData } from '../config/request'

export const fetchLocation = id => dispatch => {
    dispatch({type: FETCHING_LOCATION})
 
    return getData(`/locations/${id}.json`)
        .then(data => dispatch(getLocationSuccess(data)))
        .catch(err => dispatch(getLocationFailure(err)))
}
  
  
export const getLocationSuccess = (data) => {
    return {
        type: FETCHING_LOCATION_SUCCESS,
        location: data,
    }
}
  
export const getLocationFailure = () => {
    return {
        type: FETCHING_LOCATION_FAILURE
    }
}

export const confirmLocationIsUpToDate = (body, id, username) => dispatch => {
    return putData(`/locations/${id}/confirm.json`, body)
        .then(data => dispatch(locationDetailsConfirmed(data.msg, username, id)), 
            err => {throw err }
        )
        .catch(err => dispatch({type: DISPLAY_ERROR, err}))
}

const locationDetailsConfirmed = (msg, username, id) => {
    return {
        type: LOCATION_DETAILS_CONFIRMED,
        msg,
        username,
        id,
    }
}

export const closeConfirmModal = () => {
    return {
        type: CLOSE_CONFIRM_MODAL,
    }
}

export const setCurrentMachine = id => (dispatch, getState) => {
    const { location } = getState().location
    const location_machine_xrefs = location.location_machine_xrefs ? location.location_machine_xrefs : []
    const lmx = location_machine_xrefs.find(machine => machine.id === id)

    // TODO: Error handling for if no lmx comes back
    return dispatch({ type: SET_SELECTED_LMX, lmx })
}

export const addMachineCondition = (condition, lmx) => (dispatch, getState) => {
    const { email, authentication_token } = getState().user
    const body = {
        user_email: email,
        user_token: authentication_token,
        condition,
    }

    return putData(`/location_machine_xrefs/${lmx}.json`, body)
        .then(data => dispatch(machineConditionUpdated(data)))
        .catch(err => console.log(err))
}

export const machineConditionUpdated = (data) => {
    return {
        type: MACHINE_CONDITION_UPDATED,
        machine: data.location_machine,
    }
}

export const addMachineScore = (score, lmx) => (dispatch, getState) => {
    const { email, authentication_token } = getState().user
    const body = {
        user_email: email,
        user_token: authentication_token,
        score,
        location_machine_xref_id: lmx
    }

    return postData(`/machine_score_xrefs.json`, body)
        .then(data => dispatch(machineScoreAdded(data)))
        .catch(err => console.log(err))
}

export const machineScoreAdded = (data) => {
    return {
        type: MACHINE_SCORE_ADDED,
        score: data.machine_score_xref,
    }
}

export const removeMachineFromLocation = (curLmx, location_id) => (dispatch, getState) => {
    const { id: lmx, machine_id } = curLmx
    const { email, authentication_token } = getState().user
    const body = {
        user_email: email,
        user_token: authentication_token,
    }
    const { machines } = getState().machines
    const nameManYear = machines.find(machine => machine.id === machine_id).nameManYear

    return deleteData(`/location_machine_xrefs/${lmx}.json `, body)
        .then(() => dispatch(locationMachineRemoved(lmx, nameManYear, location_id)), 
            err => { throw err })
        .catch(err => dispatch({type: DISPLAY_ERROR, err}))
}

export const locationMachineRemoved = (lmx, nameManYear, location_id) => {
    return {
        type: LOCATION_MACHINE_REMOVED,
        lmx,
        nameManYear,
        location_id,
    }
}

export const addMachineToLocation = (machine, condition) => (dispatch, getState) => {
    dispatch({type: ADDING_MACHINE_TO_LOCATION})
    
    const { id: machine_id } = machine
    const { email, authentication_token } = getState().user
    const { id: location_id } = getState().location.location
    const body = {
        user_email: email,
        user_token: authentication_token,
        location_id,
        machine_id,
    }

    if (condition)
        body.condition = condition
        
    return postData(`/location_machine_xrefs.json`, body)
        .then(() => 
            dispatch(machineAddedToLocation(location_id, machine)),
        err => { throw err })
        .catch(err => dispatch(addMachineToLocationFailure(err)))
}

const machineAddedToLocation = (location_id, machine) => dispatch => 
    dispatch({
        type: MACHINE_ADDED_TO_LOCATION,
        location_id,
        machine,
    })

export const addMachineToLocationFailure = (err) => dispatch => {
    dispatch({type: DISPLAY_ERROR, err})
    dispatch({type: MACHINE_ADDED_TO_LOCATION_FAILURE})
} 

export const updateLocationDetails = (goBack, phone, website, description, location_type, operator_id) => (dispatch, getState) => {
    dispatch({ type: UPDATING_LOCATION_DETAILS })

    const { email, authentication_token, username } = getState().user
    const { id } = getState().location.location
    const body = {
        user_email: email,
        user_token: authentication_token,
        phone, 
        website,
        description,
        location_type,
        operator_id,
    }

    return putData(`/locations/${id}.json`, body)
        .then(data => dispatch(locationDetailsUpdated(goBack, data, username)))
        .catch(err => dispatch(updateLocationDetailsFailure(err)))
}

export const locationDetailsUpdated = (goBack, data, username) => dispatch => {
    dispatch({type: LOCATION_DETAILS_UPDATED, data, username})
    goBack()
}

export const updateLocationDetailsFailure = (err) => dispatch => {
    dispatch({type: DISPLAY_ERROR, err})
    dispatch({type: FAILED_LOCATION_DETAILS_UPDATE})
}

export const addMachineToList = machine => ({ type: ADD_MACHINE_TO_LIST, machine })
export const removeMachineFromList = machine => ({ type: REMOVE_MACHINE_FROM_LIST, machine })
export const clearMachineList = () => ({ type: CLEAR_MACHINE_LIST })

export const suggestLocation = (locationDetails) => (dispatch, getState) => {
    dispatch({ type: SUGGESTING_LOCATION }) 

    const { email, authentication_token, lat, lon, locationTrackingServicesEnabled  } = getState().user
    const {
        locationName: location_name,
        street: location_street, 
        city: location_city, 
        state: location_state,
        zip: location_zip,
        country: location_country,
        phone: location_phone,
        website: location_website,
        description: location_comments,
        locationType: location_type, 
        operator: location_operator,
        machineList,
    } = locationDetails
    
    const location_machines = `${machineList.map(m => m.nameManYear).join(', ')},`
    
    const body = {
        user_email: email,
        user_token: authentication_token,
        location_name,
        location_street,
        location_city,
        location_state,
        location_zip,
        location_country,
        location_phone,
        location_website,
        location_comments,
        location_type,
        location_operator,
        location_machines,
    }

    if (locationTrackingServicesEnabled) {
        body.lat = lat
        body.lon = lon
    }

    return postData(`/locations/suggest.json`, body)
        .then(response => {
            if (response.errors) {
                throw new Error(response.errors)
            }
            dispatch(locationSuggested())
        }, err => { throw err })
        .catch(err => dispatch(suggestLocationFailure(err)))
}

export const locationSuggested = () => dispatch => {
    dispatch({type: LOCATION_SUGGESTED })
}

export const suggestLocationFailure = (err) => dispatch => {
    dispatch({type: DISPLAY_ERROR, err})
    dispatch({type: FAILED_SUGGEST_LOCATION})
}