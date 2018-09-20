import * as types from '../../actions/types'
import locationsReducer, { initialState } from '../locations.js'

const getInitialState = () => {
    return ({
        isFetchingLocationTypes: false,
        locationTypes: [],
        isFetchingLocations: false,
        mapLocations: []
    })
}   

describe('locations reducer', () => {

    it('should return correct default state', () => {
        expect(locationsReducer(undefined, {})).toEqual(initialState)
    })

    it('should return current state when action is not recognized', () => {
        const state = getInitialState()
        const action = {
            type: 'NOBODY_KNOWS_WHAT_THIS_ACTION_DOES'
        }

        const result = locationsReducer(state, action)
        expect(result).toEqual(state)
    })

    it('should properly update state when requesting location types', () => {
        let state = getInitialState()
        const action = {
            type: types.FETCHING_LOCATION_TYPES,
        }

        const result = locationsReducer(state, action)
        expect(result.isFetchingLocationTypes).toBeTruthy()
    })

    it('should properly update state when successfully receivng location types', () => {
        let state = getInitialState()

        state.isFetchingLocationTypes = true
        const locationTypes = [{
            id: 42,
            name: 'Amusement Park',
        }, {
            id: 2,
            name: 'Bar',
        }]

        const action = {
            type: types.FETCHING_LOCATION_TYPES_SUCCESS,
            locationTypes,
        }

        const result = locationsReducer(state, action)
        expect(result.isFetchingLocationTypes).toBeFalsy()
        expect(result.locationTypes).toEqual(locationTypes)
    })


    it('should properly update state when failing to receive location types', () => {
        let state = getInitialState()

        state.isFetchingLocationTypes = true
        const locationTypes = []

        const action = {
            type: types.FETCHING_LOCATION_TYPES_FAILURE,
        }

        const result = locationsReducer(state, action)
        expect(result.isFetchingLocationTypes).toBeFalsy()
        expect(result.locationTypes).toEqual(locationTypes)
    })

    it('should properly update state when requesting locations', () => {
        let state = getInitialState()
        const action = {
            type: types.FETCHING_LOCATIONS,
        }

        const result = locationsReducer(state, action)
        expect(result.isFetchingLocations).toBeTruthy()
    })

    it('should properly update state when refetching locations', () => {
        let state = getInitialState()
        const action = {
            type: types.REFETCHING_LOCATIONS,
        }

        const result = locationsReducer(state, action)
        expect(result.isRefetchingLocations).toBeTruthy()
    })

    it('should properly update state when successfully receivng locations', () => {
        let state = getInitialState()

        state.isFetchingLocations = true
        const locations = [{
            id: 1,
            name: 'Location 1'
        }, {
            id: 2,
            name: 'Location 2'
        }]

        const action = {
            type: types.FETCHING_LOCATIONS_SUCCESS,
            locations,
        }

        const result = locationsReducer(state, action)
        expect(result.isFetchingLocations).toBeFalsy()
        expect(result.mapLocations).toEqual(locations)
    })


    it('should properly update state when failing to receive locations', () => {
        let state = getInitialState()

        state.isFetchingLocations = true
        const locations = []

        const action = {
            type: types.FETCHING_LOCATIONS_FAILURE,
        }

        const result = locationsReducer(state, action)
        expect(result.isFetchingLocations).toBeFalsy()
        expect(result.mapLocations).toEqual(locations)
    })

})