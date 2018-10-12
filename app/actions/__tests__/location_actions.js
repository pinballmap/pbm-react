import * as locationActions from '../locations_actions'
import * as types from '../types'
import { getData } from '../../config/request'
jest.mock('../../config/request')

afterEach(() => getData.mockClear())

describe('testing location actions', () => {
    it('dispatched the expected actions when successfully requesting location types', (done) => {
        const location_types = [{
            id: 42,
            name: 'Amusement Park'
        }]
        const firstAction = { type: types.FETCHING_LOCATION_TYPES }

        const secondAction = {
            type: types.FETCHING_LOCATION_TYPES_SUCCESS,
            locationTypes: location_types,
        }

        getData.mockImplementationOnce(() => Promise.resolve({ location_types }))

        const dispatch = jest.fn()
        const url = '/testurl'

        locationActions.fetchLocationTypes(url)(dispatch)
            .then(() => {
                expect(getData.mock.calls.length).toBe(1)
                expect(getData.mock.calls[0][0]).toBe(url)
                expect(dispatch.mock.calls.length).toBe(2)
                expect(dispatch.mock.calls[0][0]).toEqual(firstAction)
                expect(dispatch.mock.calls[1][0]).toEqual(secondAction)
                done()
            }) 
    })

    it('dispatched the expected actions when requesting location types fails', (done) => {
        const message = 'API response was not ok'
        const firstAction = { type: types.FETCHING_LOCATION_TYPES }

        const secondAction = {
            type: types.FETCHING_LOCATION_TYPES_FAILURE,  
        }

        getData.mockImplementationOnce(() => Promise.reject({  }))

        const dispatch = jest.fn()
        const url = '/testurl'

        locationActions.fetchLocationTypes(url)(dispatch)
            .then(() => {
                expect(getData.mock.calls.length).toBe(1)
                expect(getData.mock.calls[0][0]).toBe(url)
                expect(dispatch.mock.calls.length).toBe(2)
                expect(dispatch.mock.calls[0][0]).toEqual(firstAction)
                expect(dispatch.mock.calls[1][0]).toEqual(secondAction)
                done()
            }) 
    })

    it('dispatched the expected actions when successfully requesting locations', (done) => {
        const locations = [{
            id: 1,
            name: 'Location 1'
        }, {
            id: 2,
            name: 'Location 2'
        }]
        const firstAction = { type: types.FETCHING_LOCATIONS }

        const secondAction = {
            type: types.FETCHING_LOCATIONS_SUCCESS,
            locations,
        }

        getData.mockImplementationOnce(() => Promise.resolve({ locations }))

        const dispatch = jest.fn()
        const url = '/testurl'

        locationActions.fetchLocations(url)(dispatch)
            .then(() => {
                expect(getData.mock.calls.length).toBe(1)
                expect(getData.mock.calls[0][0]).toBe(url)
                expect(dispatch.mock.calls.length).toBe(2)
                expect(dispatch.mock.calls[0][0]).toEqual(firstAction)
                expect(dispatch.mock.calls[1][0]).toEqual(secondAction)
                done()
            }) 
    })

    it('dispatched the expected actions when requesting location types fails', (done) => {
        const message = 'API response was not ok'
        const firstAction = { type: types.FETCHING_LOCATIONS }

        const secondAction = {
            type: types.FETCHING_LOCATIONS_FAILURE,  
        }

        getData.mockImplementationOnce(() => Promise.reject({  }))

        const dispatch = jest.fn()
        const url = '/testurl'

        locationActions.fetchLocations(url)(dispatch)
            .then(() => {
                expect(getData.mock.calls.length).toBe(1)
                expect(getData.mock.calls[0][0]).toBe(url)
                expect(dispatch.mock.calls.length).toBe(2)
                expect(dispatch.mock.calls[0][0]).toEqual(firstAction)
                expect(dispatch.mock.calls[1][0]).toEqual(secondAction)
                done()
            }) 
    })

    it('dispatched the expected action when requesting a refetch of locations', () => {
        const action = { type: types.REFETCHING_LOCATIONS }

        const dispatch = jest.fn()
        const url = '/testurl'

        locationActions.fetchLocations(url, true)(dispatch)
            .then(() => {
                expect(dispatch.mock.calls[0][0]).toEqual(firstAction)
                done()
            })
    })
})