import * as operatorsActions from '../operators_actions'
import * as types from '../types'
import { getData } from '../../config/request'
jest.mock('../../config/request')

afterEach(() => getData.mockClear())

describe('testing machine actions', () => {
    it('dispatched the expected actions when successfully requesting operators', (done) => {
        const operators = [{
            id: 67,
            name: "20XX Amusements",
            region_id: 3,
            email: "bobbyconover@gmail.com",
            website: "",
            phone: "",
            created_at: "2013-10-01T22:24:47.195Z",
            updated_at: "2013-10-01T22:24:47.195Z",
        }, {
            id: 52,
            name: "AAA Amusements",
            region_id: 34,
            email: "",
            website: "",
            phone: "",
            created_at: "2013-02-15T05:05:32.382Z",
            updated_at: "2013-02-15T05:05:32.382Z",
        }]

        const firstAction = { type: types.FETCHING_OPERATORS }

        const secondAction = {
            type: types.FETCHING_OPERATORS_SUCCESS,
            operators,
        }

        getData.mockImplementationOnce(() => Promise.resolve({ operators }))

        const dispatch = jest.fn()
        const url = '/testurl'

        operatorsActions.fetchOperators(url)(dispatch)
            .then(() => {
                expect(getData.mock.calls.length).toBe(1)
                expect(getData.mock.calls[0][0]).toBe(url)
                expect(dispatch.mock.calls.length).toBe(2)
                expect(dispatch.mock.calls[0][0]).toEqual(firstAction)
                expect(dispatch.mock.calls[1][0]).toEqual(secondAction)
                done()
            }) 
    })

    it('dispatched the expected actions when requesting operators fails', (done) => {
        const message = 'API response was not ok'
        const firstAction = { type: types.FETCHING_OPERATORS }

        const secondAction = {
            type: types.FETCHING_OPERATORS_FAILURE,  
        }

        getData.mockImplementationOnce(() => Promise.reject({  }))

        const dispatch = jest.fn()
        const url = '/testurl'

        operatorsActions.fetchOperators(url)(dispatch)
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