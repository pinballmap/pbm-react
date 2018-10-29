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
        .then(data => dispatch(locationDetailsConfirmed(data.msg, username)))
        .catch(err => console.log(err))
}

const locationDetailsConfirmed = (msg, username) => {
    return {
        type: LOCATION_DETAILS_CONFIRMED,
        msg,
        username,
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

export const removeMachineFromLocation = lmx => (dispatch, getState) => {
    const { email, authentication_token } = getState().user
    const body = {
        user_email: email,
        user_token: authentication_token,
    }

    return deleteData(`/location_machine_xrefs/${lmx}.json `, body)
        .then(() => dispatch(locationMachineRemoved(lmx)))
        .catch(err => console.log(err))
}

export const locationMachineRemoved = (lmx) => {
    return {
        type: LOCATION_MACHINE_REMOVED,
        lmx,
    }
}
