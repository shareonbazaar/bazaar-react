import React from 'react'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT_CONFIRM = 'LOGOUT_CONFIRM'
export const PROFILE_REQUEST = 'PROFILE_REQUEST'
export const PROFILE_RECEIVED = 'PROFILE_RECEIVED'

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
    return (dispatch, getState) => {
        const config = {
            headers: {
                token: localStorage.getItem('token'),
            }
        };
        dispatch(requestProfile(id));

        return fetch('/api/users/' + id, config)
        .then(response => response.json())
        .then(user => {
            dispatch(receiveProfile(user));
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
  let config = {
    method: 'POST',
    headers: { 
        'Content-Type':'application/json'
    },
    body: JSON.stringify(creds.data),
  }

  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds))

    return fetch(creds.endpoint, config)
      .then(response =>
        response.json().then(user => ({ user, response }))
            ).then(({ user, response }) =>  {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(loginError(user.message))
          return Promise.reject(user)
        } else {
          // If login was successful, set the token in local storage
          localStorage.setItem('token', user.token)
          // Dispatch the success action
          dispatch(receiveLogin(user.user))
        }
      }).catch(err => console.log("Error: ", err))
  }
}