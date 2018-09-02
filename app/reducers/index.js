import { combineReducers } from 'redux'
import query from './queries'
import locations from './locations'
import machines from './machines'
import user from './user'
import operators from './operators'

export default combineReducers({
    query,
    locations,
    machines,
    user,
    operators,
})