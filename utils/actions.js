import React from 'react'
import queryString from 'query-string'
import { push } from 'react-router-redux'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT_CONFIRM = 'LOGOUT_CONFIRM'
export const PROFILE_REQUEST = 'PROFILE_REQUEST'
export const PROFILE_RECEIVED = 'PROFILE_RECEIVED'
export const TRANSACTIONS_REQUEST = 'TRANSACTIONS_REQUEST'
export const TRANSACTIONS_RECEIVED = 'TRANSACTIONS_RECEIVED'
export const CATEGORIES_REQUEST = 'CATEGORIES_REQUEST'
export const CATEGORIES_RECEIVED = 'CATEGORIES_RECEIVED'
export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'
export const SUBMIT_REQUEST = 'SUBMIT_REQUEST'
export const CONFIRM_REQUEST_SUBMISSION = 'CONFIRM_REQUEST_SUBMISSION'
export const SUBMIT_REVIEW = 'SUBMIT_REVIEW'
export const CONFIRM_REVIEW_SUBMISSION = 'CONFIRM_REVIEW_SUBMISSION'
export const USERS_REQUEST = 'USERS_REQUEST'
export const USERS_RECEIVED = 'USERS_RECEIVED'
export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST'
export const UPDATE_PROFILE_RECEIVED = 'UPDATE_PROFILE_RECEIVED'
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE'
export const CLEAR_PROFILE_ALERT = 'CLEAR_PROFILE_ALERT'
export const CONTACT_SUBMIT_REQUEST = 'CONTACT_SUBMIT_REQUEST'
export const CONTACT_SUBMIT_CONFIRMED = 'CONTACT_SUBMIT_CONFIRMED'
export const CLEAR_CONTACT_ALERT = 'CLEAR_CONTACT_ALERT'
export const DELETE_ACCOUNT_REQUEST = 'DELETE_ACCOUNT_REQUEST'
export const DELETE_ACCOUNT_CONFIRMED = 'DELETE_ACCOUNT_CONFIRMED'
export const FORGOT_REQUEST = 'FORGOT_REQUEST'
export const CLEAR_FORGOT_EMAIL = 'CLEAR_FORGOT_EMAIL'

function callApi (endpoint, method='GET', data={}) {
    var config = {
        headers: {
            token: localStorage.getItem('token'),
        },
        method,
    };
    if (method !== 'GET') {
        config.headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(data);
    }
    return fetch(endpoint, config)
    .then(response => response.json())
}

export const setVisibilityFilter = (filter) => {
  return {
    type: SET_VISIBILITY_FILTER,
    filter,
  }
}


// FIXME: Is this correct?? I'm using an async action
// but not actually doing anything async like a network request
// I'm just using it so I can do a side-effect: removing from localStorage
export function requestLogout () {
    return dispatch => {
        localStorage.removeItem('token');
        dispatch({type: LOGOUT_CONFIRM})
    }
}


export function skillRequest (data) {
    return dispatch => {
        dispatch({type: SUBMIT_REQUEST});
        return callApi('/api/transactions', 'POST', data)
        .then (confirmation => dispatch({type: CONFIRM_REQUEST_SUBMISSION}))
    }
}

export function submitReview (data) {
    return dispatch => {
        dispatch({type: SUBMIT_REVIEW});
        return callApi('/api/reviews', 'POST', data)
        .then (confirmation => {
            dispatch({type: CONFIRM_REVIEW_SUBMISSION});
            dispatch(loadTransactions());
        })
    }
}


export function loadProfile (id) {
    return dispatch => {
        dispatch({type: PROFILE_REQUEST, id});
        return callApi(`/api/users/${id}`)
        .then(({user, error}) => {
            if (error) {
                console.log(error)
            } else {
                return dispatch({
                    type: PROFILE_RECEIVED,
                    user
                });
            }
        })
    }
}

export function loadUsers (query) {
    return dispatch => {
        dispatch({type: USERS_REQUEST});
        return callApi(`/api/users?${queryString.stringify(query, {arrayFormat: 'bracket'})}`)
        .then(({users, error}) => {
            if (error) {
                console.log(error)
            } else {
                return dispatch({
                    type: USERS_RECEIVED,
                    users,
                });
            }
        });
    }
}

export function getSurprise () {
    return dispatch => {
        return callApi('/api/surprise')
        .then(({user, error}) => {
            if (error) {
                console.log(error)
            } else {
                if (user) {
                    return dispatch(push(`/profile/${user._id}`))
                }
            }
        });
    }
}

export function updateTransaction (body) {
    return dispatch => {
        dispatch({
            type: UPDATE_TRANSACTION,
            t_id: body.t_id,
        });
        return callApi('/api/transactions', 'POST', body)
        .then(response => dispatch(loadTransactions()))
    }
}

export function confirmTransaction (body) {
    return dispatch => {
        dispatch({
            type: UPDATE_TRANSACTION,
            t_id: body.t_id,
        });
        return callApi('/api/confirmTransaction', 'POST', body)
        .then(response => dispatch(loadTransactions()))
    }
}

export function loadTransactions () {
    return dispatch => {
        dispatch({type: TRANSACTIONS_REQUEST});
        return callApi('/api/transactions')
        .then(transactions => dispatch({
            type: TRANSACTIONS_RECEIVED,
            transactions,
        }));
    }
}

export function loadCategories () {
    return dispatch => {
        dispatch({type: CATEGORIES_REQUEST});
        return callApi('/api/categories')
        .then(categories => dispatch({
            type: CATEGORIES_RECEIVED,
            categories
        }));
    }
}

export function clearProfileAlert () {
    return {
        type: CLEAR_PROFILE_ALERT,
    }
}

export function updateProfile (data) {
    var config = {
        headers: {
            token: localStorage.getItem('token'),
        },
        method: 'POST',
        body: data,
    };
    return dispatch => {
        dispatch({
            type: UPDATE_PROFILE_REQUEST,
        });
        return fetch('/api/users', config)
        .then(response => response.json())
        .then(({error, data}) => {
            if (error) {
                console.log(error)
                dispatch({
                    type: UPDATE_PROFILE_FAILURE,
                    message: error,
                })
            } else {
                dispatch({
                    type: UPDATE_PROFILE_RECEIVED,
                    user: data,
                })
            }
        })
        .catch(err => console.log(err))
    }
}

export function deleteAccount () {
    return dispatch => {
        dispatch({
            type: DELETE_ACCOUNT_REQUEST,
        });
        return callApi('/api/users', 'DELETE', )
        .then(({error, data}) => {
            if (error) {
                console.log(error)
            } else {
                localStorage.removeItem('token');
                dispatch({
                    type: DELETE_ACCOUNT_CONFIRMED,
                })
                return dispatch(push('/'))
            }
        })
    }
}

export function clearContactAlert () {
    return {
        type: CLEAR_CONTACT_ALERT,
    }
}

export function submitContact (data) {
    return dispatch => {
        dispatch({
            type: CONTACT_SUBMIT_REQUEST,
        });
        return callApi('/api/contact', 'POST', data)
        .then(({error, data}) => {
            if (error) {
                console.log(error)
                dispatch({
                    type: CONTACT_SUBMIT_CONFIRMED,
                    response: {type: 'error', message: error}
                })
            } else {
                dispatch({
                    type: CONTACT_SUBMIT_CONFIRMED,
                    response: {
                        type: 'success',
                        message: "Thanks for submitting! We'll get back to you shortly"
                    }
                })
            }
        })
    }
}

export function clearForgotEmail () {
    return {
        type: CLEAR_FORGOT_EMAIL,
    }
}

export function forgotPasswordRequest (forgotEmail) {
    return dispatch => {
        dispatch({type: FORGOT_REQUEST, forgotEmail})
        return callApi('/api/forgot', 'POST', {forgotEmail})
    }
}

export function loginUser (creds) {
    return dispatch => {
        dispatch({
            type: LOGIN_REQUEST,
            creds,
        });
        return callApi(creds.endpoint, 'POST', creds.data)
        .then (({user, error, token}) => {
            if (error) {
                // If there was a problem, we want to
                // dispatch the error condition
                dispatch({
                    type: LOGIN_FAILURE,
                    message: error.toString(),
                })
                return Promise.reject(user)
            } else {
                // If login was successful, set the token in local storage
                localStorage.setItem('token', token)
                // Dispatch the success action
                dispatch({
                    type: LOGIN_SUCCESS,
                    user,
                })
            }
        }).catch(err => console.log("Error: ", err))
    }
}
