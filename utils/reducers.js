import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_CONFIRM,
  PROFILE_REQUESTED, PROFILE_RECEIVED,
  TRANSACTIONS_REQUEST, TRANSACTIONS_RECEIVED,
  CATEGORIES_REQUEST, CATEGORIES_RECEIVED,
  SUBMIT_REQUEST, CONFIRM_REQUEST_SUBMISSION,
  USERS_REQUEST, USERS_RECEIVED,
  UPDATE_TRANSACTION, SET_VISIBILITY_FILTER,
  UPDATE_PROFILE_REQUEST, UPDATED_PROFILE_RECEIVED,
  CONTACT_SUBMIT_CONFIRMED, CLEAR_CONTACT_ALERT,
  DELETE_ACCOUNT_REQUEST, DELETE_ACCOUNT_CONFIRMED,
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
        case DELETE_ACCOUNT_CONFIRMED:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: false,
                user: {},
            })
        case UPDATE_PROFILE_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
            })
        case UPDATED_PROFILE_RECEIVED:
            return Object.assign({}, state, {
                isFetching: false,
                user: action.user,
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
        case UPDATE_TRANSACTION:
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
    items: null
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

function categories (state = {
    isFetching: false,
    items: []
    }, action) {
    switch (action.type) {
        case CATEGORIES_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
            })
        case CATEGORIES_RECEIVED:
            return Object.assign({}, state, {
                isFetching: false,
                items: action.categories,
            })
        default:
            return state;
    }
}

function contact (state = {
    response: null
    }, action) {
    switch (action.type) {
        case CONTACT_SUBMIT_CONFIRMED:
            return Object.assign({}, state, {
                response: action.response,
            })
        case CLEAR_CONTACT_ALERT:
            return Object.assign({}, state, {
                response: null,
            })
        default:
            return state;
    }
}

const appReducer = combineReducers({
    routing: routerReducer,
    auth,
    userProfile,
    transactions,
    requests,
    users,
    categories,
    contact,
})

export default (state, action) => {
    if (action.type === LOGOUT_CONFIRM) {
        state = Object.assign({}, appReducer({}, {}), {
            routing: state.routing,
        });
    }
    return appReducer(state, action)
}
