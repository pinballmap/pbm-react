import { combineReducers } from 'redux'
import query from './query_reducer'
import locations from './locations'
import machines from './machines'

export default combineReducers({
    query,
    locations,
    machines,
})