import * as machinesActions from '../machines_actions'
import * as types from '../types'
import { getData } from '../../config/request';
jest.mock('../../config/request');

afterEach(() => getData.mockClear())

describe('testing machine actions', () => {
    it('dispatched the expected actions when successfully requesting machines', (done) => {
        const machines = [{
            id: 676,
            name: 'Pirates of the Caribbean'
        }, {
            id: 678,
            name: 'Revenge From Mars'
        }]
        const firstAction = { type: types.FETCHING_MACHINES }

        const secondAction = {
            type: types.FETCHING_MACHINES_SUCCESS,
            machines,
        }

        getData.mockImplementationOnce(() => Promise.resolve({ machines }));

        const dispatch = jest.fn()
        const url = '/testurl'

        machinesActions.fetchMachines(url)(dispatch)
            .then(() => {
                expect(getData.mock.calls.length).toBe(1)
                expect(getData.mock.calls[0][0]).toBe(url)
                expect(dispatch.mock.calls.length).toBe(2)
                expect(dispatch.mock.calls[0][0]).toEqual(firstAction)
                expect(dispatch.mock.calls[1][0]).toEqual(secondAction)
                done()
            }) 
    })

    it('dispatched the expected actions when requesting machines fails', (done) => {
        const message = 'API response was not ok'
        const firstAction = { type: types.FETCHING_MACHINES }

        const secondAction = {
            type: types.FETCHING_MACHINES_FAILURE,  
        }

        getData.mockImplementationOnce(() => Promise.reject({  }));

        const dispatch = jest.fn()
        const url = '/testurl'

        machinesActions.fetchMachines(url)(dispatch)
            .then(() => {
                expect(getData.mock.calls.length).toBe(1)
                expect(getData.mock.calls[0][0]).toBe(url)
                expect(dispatch.mock.calls.length).toBe(2)
                expect(dispatch.mock.calls[0][0]).toEqual(firstAction)
                expect(dispatch.mock.calls[1][0]).toEqual(secondAction)
                done()
            }) 
    })
})