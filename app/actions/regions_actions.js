import {
    FETCHING_REGIONS,
    FETCHING_REGIONS_SUCCESS,
    FETCHING_REGIONS_FAILURE,
    FETCHING_LOCATION_AND_MACHINE_COUNTS_SUCCESS,
} from './types'

import { getData } from '../config/request'

export const getRegions = (url) => dispatch => {
    dispatch({type: FETCHING_REGIONS})

    return getData(url)
        .then(data => dispatch(getRegionsSuccess(data)))
        .catch(err => dispatch(getRegionsFailure(err)))
}


export const getRegionsSuccess = (data) => {
    return {
        type: FETCHING_REGIONS_SUCCESS,
        regions: data.regions,
    }
}

export const getRegionsFailure = () => {
    return {
        type: FETCHING_REGIONS_FAILURE
    }
}

export const getLocationAndMachineCounts = (url) => dispatch => {
    return getData(url)
        .then(data => dispatch(getLocationAndMachineCountsSuccess(data)))
}

export const getLocationAndMachineCountsSuccess = data => {
    return {
        type: FETCHING_LOCATION_AND_MACHINE_COUNTS_SUCCESS,
        allMachinesCount: data.num_lmxes,
        allLocationsCount: data.num_locations,
    }
}
