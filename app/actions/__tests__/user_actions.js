import * as userActions from '../user_actions'
import * as types from '../types'
import { getCurrentLocation  } from '../../config/request';
jest.mock('../../config/request');

afterEach(() => getCurrentLocation.mockClear())

describe('testing user actions', () => {
    it('dispatched the expected actions when successfully requesting user location', (done) => {
        const coords = {
            latitude: 37.785834,
            longitude: -122.406417
        }
        const firstAction = { type: types.FETCHING_LOCATION_TRACKING_ENABLED}

        const secondAction = {
            type: types.FETCHING_LOCATION_TRACKING_SUCCESS,
            lat: coords.latitude,
            lon: coords.longitude
        }

        getCurrentLocation.mockImplementationOnce(() => Promise.resolve({ coords }));
        const dispatch = jest.fn()

        userActions.fetchCurrentLocation()(dispatch)
            .then(() => {
                expect(dispatch.mock.calls.length).toBe(2)
                expect(dispatch.mock.calls[0][0]).toEqual(firstAction)
                expect(dispatch.mock.calls[1][0]).toEqual(secondAction)
                done()
            }) 
    })

    it('dispatched the expected actions when requesting user location fails', (done) => {
        const firstAction = { type: types.FETCHING_LOCATION_TRACKING_ENABLED }

        const secondAction = {
            type: types.FETCHING_LOCATION_TRACKING_FAILURE,  
        }

        getCurrentLocation.mockImplementationOnce(() => Promise.reject({  }));
        const dispatch = jest.fn()

        userActions.fetchCurrentLocation()(dispatch)
            .then(() => {
                expect(dispatch.mock.calls.length).toBe(2)
                expect(dispatch.mock.calls[0][0]).toEqual(firstAction)
                expect(dispatch.mock.calls[1][0]).toEqual(secondAction)
                done()
            }) 
    })
})