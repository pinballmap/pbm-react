import { combineReducers } from 'redux'
import query from './query_reducer'
import locations from './locations_reducer'
import location_types from './location_types_reducer'

export default combineReducers({
    query,
    locations,
    location_types,
})