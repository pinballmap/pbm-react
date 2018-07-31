import * as queryActions from '../query_actions'
import * as types from '../types'

describe('testing query actions', () => {
    it('dispatched the expected action when the query is updated', () => {
        const query = 'my new query'
        const expectedAction = { 
            type: types.UPDATE_QUERY,
            payload: query,
        }

        expect(queryActions.updateQuery(query)).toEqual(expectedAction)
    })

    it('dispatched the expected action when the location id is updated', () => {
        const id = 678
        const expectedAction = { 
            type: types.SET_LOCATION_ID,
            payload: id
        }

        expect(queryActions.setLocationId(id)).toEqual(expectedAction)
    })

    it('dispatched the expected action when current coordinates are updated', () => {
        const lat = 123
        const lon = 456

        const expectedAction = { 
            type: types.UPDATE_COORDINATES,
            lat,
            lon,
        }

        expect(queryActions.updateCurrCoordindates(lat, lon)).toEqual(expectedAction)
    })
})