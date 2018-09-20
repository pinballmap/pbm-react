import * as types from '../../actions/types'
import operatorsReducer, { initialState } from '../operators.js'

const getInitialState = () => {
    return ({
        isFetchingOperators: false,
        operators: [],
    })
}   

describe('operators reducer', () => {

    it('should return correct default state', () => {
        expect(operatorsReducer(undefined, {})).toEqual(initialState)
    })

    it('should return current state when action is not recognized', () => {
        const state = getInitialState()
        const action = {
            type: 'NOBODY_KNOWS_WHAT_THIS_ACTION_DOES'
        }

        const result = operatorsReducer(state, action)
        expect(result).toEqual(state)
    })

    it('should properly update state when requesting operators', () => {
        let state = getInitialState()
        const action = {
            type: types.FETCHING_OPERATORS,
        }

        const result = operatorsReducer(state, action)
        expect(result.isFetchingOperators).toBeTruthy()
    })

    it('should properly update state when successfully receivng operators', () => {
        let state = getInitialState()

        state.isFetchingOperators = true
        
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

        const action = {
            type: types.FETCHING_OPERATORS_SUCCESS,
            operators,
        }

        const result = operatorsReducer(state, action)
        expect(result.isFetchingOperators).toBeFalsy()
        expect(result.operators).toEqual(operators)
    })

    it('should properly update state when failing to recieve operators', () => {
        let state = getInitialState()

        state.isFetchingOperators = true

        const operators = []

        const action = {
            type: types.FETCHING_OPERATORS_FAILURE,
        }

        const result = operatorsReducer(state, action)
        expect(result.isFetchingOperators).toBeFalsy()
        expect(result.operators).toEqual(operators)
    })
})