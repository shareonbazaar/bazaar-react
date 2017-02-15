import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS, LOGOUT_CONFIRM,
  PROFILE_REQUESTED, PROFILE_RECEIVED,
  TRANSACTIONS_REQUEST, TRANSACTIONS_RECEIVED,
  SUBMIT_REQUEST, CONFIRM_REQUEST_SUBMISSION,
  USERS_REQUEST, USERS_RECEIVED,
  SET_TRANSACTION_STATUS, SET_VISIBILITY_FILTER
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

function transactions (state = {
    isFetching: false,
    useAnimation: true,
    items: [],
    errorMessage: '',
    filter: 'PROPOSED',
    }, action) {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return Object.assign({}, state, {
                useAnimation: false,
                filter: action.filter,
            })
        case TRANSACTIONS_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                useAnimation: true,
            })
        case TRANSACTIONS_RECEIVED:
            return Object.assign({}, state, {
                isFetching: false,
                useAnimation: true,
                items: action.transactions,
            })
        case SET_TRANSACTION_STATUS:
            return Object.assign({}, state, {
                useAnimation: true,
                isEditing: true,
            })
        default:
          return state;
    }
}

function requests (state = {
    isSubmitting: false,
    errorMessage: '',
    }, action) {
    switch (action.type) {
        case SUBMIT_REQUEST:
            return Object.assign({}, state, {
                isSubmitting: true,
            })
        case CONFIRM_REQUEST_SUBMISSION:
            return Object.assign({}, state, {
                isSubmitting: false,
            });
        default:
            return state;
    }
}

function users (state = {
    isFetching: false,
    errorMessage: '',
    items: []
    }, action) {
    switch (action.type) {
        case USERS_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
            })
        case USERS_RECEIVED:
            return Object.assign({}, state, {
                isFetching: false,
                items: action.users,
            })
        default:
            return state;
    }
}


export default combineReducers({
    routing: routerReducer,
    auth,
    userProfile,
    transactions,
    requests,
    users
})
