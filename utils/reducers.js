import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS, LOGOUT_CONFIRM, PROFILE_REQUESTED, PROFILE_RECEIVED
} from './actions'


function loginFilter (state) {
	return state
}

function auth(state = {
    isFetching: false,
    isAuthenticated: false, //localStorage.getItem('token') ? true : false,
    errorMessage: '',
    user: {},
    creds: {},
  }, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                isAuthenticated: false,
                creds: action.creds,
                user: {},
            })
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: true,
                user: action.user,
                errorMessage: '',
            })
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: false,
                errorMessage: action.message,
            })
        case LOGOUT_CONFIRM:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: false,
                user: {},
            })
        default:
          return state
  }
}

function userProfile(state = {
    isFetching: false,
    user: {},
    errorMessage: '',
    }, action) {
    switch (action.type) {
        case PROFILE_REQUESTED:
            return Object.assign({}, state, {
                isFetching: true,
            })
        case PROFILE_RECEIVED:
            return Object.assign({}, state, {
                isFetching: false,
                user: action.user,
            })
        default:
          return state;
    }
}


export default combineReducers({
    routing: routerReducer,
    auth,
    userProfile,
})
