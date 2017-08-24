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
  UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_RECEIVED, UPDATE_PROFILE_FAILURE,
  CLEAR_PROFILE_ALERT,
  CONTACT_SUBMIT_CONFIRMED, CLEAR_CONTACT_ALERT,
  DELETE_ACCOUNT_REQUEST, DELETE_ACCOUNT_CONFIRMED,
  FORGOT_REQUEST, CLEAR_FORGOT_EMAIL,
  STAGE_SELECTED, SKILL_SELECTED, INTEREST_SELECTED, ABOUT_ME_CHANGE, ON_START_CLICK,
  SKILL_REMOVED
} from './actions'


function auth(state = {
    isFetching: false,
    isAuthenticated: false, //localStorage.getItem('token') ? true : false,
    loginResponse: null,
    profileUpdateResponse: null,
    user: {},
    creds: {},
    forgotEmail: '',
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
                loginResponse: null,
            })
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: false,
                loginResponse: {type: 'error', message: action.message},
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
        case UPDATE_PROFILE_RECEIVED:
            return Object.assign({}, state, {
                isFetching: false,
                user: action.user,
                profileUpdateResponse: {
                    type: 'success',
                    message: 'Profile successfully updated',
                },
            })
        case UPDATE_PROFILE_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                profileUpdateResponse: {
                    type: 'error',
                    message: 'Error updating profile',
                },
            })
        case CLEAR_PROFILE_ALERT:
            return Object.assign({}, state, {
                profileUpdateResponse: null,
            })
        case FORGOT_REQUEST:
            return Object.assign({}, state, {
                forgotEmail: action.forgotEmail,
            })
        case CLEAR_FORGOT_EMAIL:
            return Object.assign({}, state, {
                forgotEmail: '',
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

function onboarding (state = {
    stage: 0,
    title: '',
    skills: [],
    interests: [],
    aboutMeText: '',
    hasStarted: false,
    }, action) {
    switch (action.type) {
        case STAGE_SELECTED:
            const { index } = action;
            const { skills, interests } = state;
            // Only allow user to progress if she has chosen at least two skills/interests
            if ((index === 3 && skills.length < 2)
                  || (index === 2 && interests.length < 2)) {
                return state;
            } else {
                return Object.assign({}, state, {
                    stage: action.index,
                });
            }
        case SKILL_SELECTED:
            if (action.isInterest) {
              if (state.interests.map(s => s._id).indexOf(action.skill._id) < 0) {
                return Object.assign({}, state, {
                  interests: state.interests.concat([action.skill]),
                });
              }
            } else {
              if (state.skills.map(s => s._id).indexOf(action.skill._id) < 0) {
                return Object.assign({}, state, {
                  skills: state.skills.concat([action.skill]),
                });
              }
            }
            return state;
        case SKILL_REMOVED:
            if (action.isInterest) {
                return Object.assign({}, state, {
                    interests: state.interests.filter(s => s._id !== action.skill._id),
                });
            } else {
                return Object.assign({}, state, {
                    skills: state.skills.filter(s => s._id !== action.skill._id),
                });
            }
        case ABOUT_ME_CHANGE:
            return Object.assign({}, state, {
                aboutMeText: action.text,
            });
        case ON_START_CLICK:
            return Object.assign({}, state, {
                hasStarted: true,
            });
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
    onboarding,
})

export default (state, action) => {
    if (action.type === LOGOUT_CONFIRM) {
        state = Object.assign({}, appReducer({}, {}), {
            routing: state.routing,
        });
    }
    return appReducer(state, action)
}
