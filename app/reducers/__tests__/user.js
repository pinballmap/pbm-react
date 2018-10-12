import * as types from '../../actions/types'
import userReducer, { initialState } from '../user.js'

const getInitialState = () => {
    return ({
        isFetchingLocationTrackingEnabled: false,
        lat: null,
        lon: null,
        locationTrackingServicesEnabled: false
    })
}   

describe('user reducer', () => {

    it('should return correct default state', () => {
        expect(userReducer(undefined, {})).toEqual(initialState)
    })

    it('should return current state when action is not recognized', () => {
        const state = getInitialState()
        const action = {
            type: 'NOBODY_KNOWS_WHAT_THIS_ACTION_DOES'
        }

        const result = userReducer(state, action)
        expect(result).toEqual(state)
    })

    it('should properly update state when requesting user location', () => {
        let state = getInitialState()
        const action = {
            type: types.FETCHING_LOCATION_TRACKING_ENABLED,
        }

        const result = userReducer(state, action)
        expect(result.isFetchingLocationTrackingEnabled).toBeTruthy()
    })

    it('should properly update state when successfully receivng user location', () => {
        let state = getInitialState()

        state.isFetchingLocationTrackingEnabled = true

        const action = {
            type: types.FETCHING_LOCATION_TRACKING_SUCCESS,
            lat: 37.785834,
            lon: -122.406417
        }

        const result = userReducer(state, action)
        expect(result.isFetchingLocationTrackingEnabled).toBeFalsy()
        expect(result.lat).toEqual(action.lat)
        expect(result.lon).toEqual(action.lon)
        expect(result.locationTrackingServicesEnabled).toBeTruthy()
    })

    it('should properly update state when failing to receive user location', () => {
        let state = getInitialState()

        state.isFetchingLocationTrackingEnabled = true

        const action = {
            type: types.FETCHING_LOCATION_TRACKING_FAILURE,
        }

        const result = userReducer(state, action)

        expect(result.isFetchingLocationTrackingEnabled).toBeFalsy()
        expect(result.lat).toBeFalsy()
        expect(result.lon).toBeFalsy()
        expect(result.locationTrackingServicesEnabled).toBeFalsy()
    })
})