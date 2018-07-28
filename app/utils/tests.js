import { createStore, applyMiddleware, compose } from 'redux'
import { combineReducers } from 'redux-immutable'
import thunkMiddleware from 'redux-thunk'


export function createStoreForTest() {
    return createStore(
        combineReducers({
            ...indexReducer,
        }),
        compose(
            applyMiddleware(thunkMiddleware),
        ),
    )
}