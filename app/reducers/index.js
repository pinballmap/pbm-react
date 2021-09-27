import { combineReducers } from 'redux'
import query from './queries'
import location from './location'
import locations from './locations'
import machines from './machines'
import user from './user'
import operators from './operators'
import error from './error'
import regions from './regions'
import app from './app'

export default combineReducers({
    query,
    location,
    locations,
    machines,
    user,
    operators,
    error,
    regions,
    app,
})
