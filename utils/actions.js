import React from 'react'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT_CONFIRM = 'LOGOUT_CONFIRM'
export const PROFILE_REQUEST = 'PROFILE_REQUEST'
export const PROFILE_RECEIVED = 'PROFILE_RECEIVED'
export const TRANSACTIONS_REQUEST = 'TRANSACTIONS_REQUEST'
export const TRANSACTIONS_RECEIVED = 'TRANSACTIONS_RECEIVED'
export const SET_TRANSACTION_STATUS = 'SET_TRANSACTION_STATUS'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'
export const SUBMIT_REQUEST = 'SUBMIT_REQUEST'
export const CONFIRM_REQUEST_SUBMISSION = 'CONFIRM_REQUEST_SUBMISSION'
export const USERS_REQUEST = 'USERS_REQUEST'
export const USERS_RECEIVED = 'USERS_RECEIVED'
export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST'
export const UPDATED_PROFILE_RECEIVED = 'UPDATED_PROFILE_RECEIVED'

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
    console.log(endpoint)
    console.log(config)
    return fetch(endpoint, config)
    .then(response => response.json())
}

export const setVisibilityFilter = (filter) => {
  return {
    type: SET_VISIBILITY_FILTER,
    filter,
  }
}


function confirmLogout () {
    return {
        type: LOGOUT_CONFIRM,
    }
}

// FIXME: Is this correct?? I'm using an async action
// but not actually doing anything async like a network request
// I'm just using it so I can do a side-effect: removing from localStorage
export function requestLogout () {
    return dispatch => {
        localStorage.removeItem('token');
        dispatch(confirmLogout())
    }
}

function submitRequest () {
    return {
        type: SUBMIT_REQUEST,
    }
}

function confirmRequestSubmission (conf) {
    return {
        type: CONFIRM_REQUEST_SUBMISSION,
    }
}

export function skillRequest (data) {
    return dispatch => {
        dispatch(submitRequest());
        return callApi('/api/transactions', 'POST', data)
        .then (confirmation => dispatch(confirmRequestSubmission(confirmation)))
    }
}

export function submitReview (data) {
    return dispatch => {
        dispatch(submitRequest());
        return callApi('/api/reviews', 'POST', data)
        .then (confirmation => {
            dispatch(confirmRequestSubmission(confirmation));
            dispatch(loadTransactions());
        })
    }
}

function requestProfile (id) {
    return {
        type: PROFILE_REQUEST,
        id,
    }
}

function receiveProfile (user) {
    return {
        type: PROFILE_RECEIVED,
        user,
    }
}

export function loadProfile (id) {
    return dispatch => {
        dispatch(requestProfile(id));
        return callApi('/api/users/' + id)
        .then(user => dispatch(receiveProfile(user)));
    }
}

function requestUsers () {
    return {
        type: USERS_REQUEST,
    }
}

function receiveUsers (users) {
    return {
        type: USERS_RECEIVED,
        users,
    }
}

export function loadUsers () {
    return dispatch => {
        dispatch(requestUsers());
        return callApi('/api/users')
        .then(users => dispatch(receiveUsers(users)));
    }
}

export function setTransactionStatus (t_id, status) {
    return dispatch => {
        dispatch({
            type: SET_TRANSACTION_STATUS,
            t_id,
            status,
        });
        return callApi('/api/transactions/' + t_id, 'PATCH', {
            status,
        }).then(response => dispatch(loadTransactions()))
    }
}

function requestTransactions () {
    return {
        type: TRANSACTIONS_REQUEST,
    }
}

function receiveTransactions (transactions) {
    return {
        type: TRANSACTIONS_RECEIVED,
        transactions,
    }
}

export function loadTransactions () {
    return dispatch => {
        dispatch(requestTransactions());
        return callApi('/api/transactions')
        .then(transactions => dispatch(receiveTransactions(transactions)));
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
            } else {
                dispatch({
                    type: UPDATED_PROFILE_RECEIVED,
                    user: data,
                })
            }
        })
    }
}

function requestLogin (creds) {
  return {
    type: LOGIN_REQUEST,
    creds
  }
}


function receiveLogin (user) {
  return {
    type: LOGIN_SUCCESS,
    user,
  }
}

function loginError (message) {
  return {
    type: LOGIN_FAILURE,
    message
  }
}

export function loginUser (creds) {
    return dispatch => {
        dispatch(submitRequest());
        return callApi(creds.endpoint || '/api/login', 'POST', creds.data)
        .then (({user, error, token}) => {
            if (error) {
                // If there was a problem, we want to
                // dispatch the error condition
                dispatch(loginError(error))
                return Promise.reject(user)
            } else {
                // If login was successful, set the token in local storage
                localStorage.setItem('token', token)
                // Dispatch the success action
                dispatch(receiveLogin(user))
            }
        }).catch(err => console.log("Error: ", err))
    }
}
