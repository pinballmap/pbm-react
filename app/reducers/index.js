import { combineReducers } from 'redux'
import query from './query_reducer'
import locations from './locations'
import machines from './machines'
import user from './user'

export default combineReducers({
    query,
    locations,
    machines,
    user,
})