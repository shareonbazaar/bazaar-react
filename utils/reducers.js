import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as actions from './actions';

function auth(state = {
  isFetching: false,
  isAuthenticated: false, // localStorage.getItem('token') ? true : false,
  loginResponse: null,
  profileUpdateResponse: null,
  user: {},
  creds: {},
  forgotEmail: '',
}, action) {
  switch (action.type) {
    case actions.LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        creds: action.creds,
        user: {},
      });
    case actions.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        user: action.user,
        loginResponse: null,
      });
    case actions.LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        loginResponse: { type: 'error', message: action.message },
      });
    case actions.LOGOUT_CONFIRM:
    case actions.DELETE_ACCOUNT_CONFIRMED:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        user: {},
      });
    case actions.UPDATE_PROFILE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case actions.UPDATE_PROFILE_RECEIVED:
      return Object.assign({}, state, {
        isFetching: false,
        user: action.user,
        profileUpdateResponse: {
          type: 'success',
          message: 'Profile successfully updated',
        },
      });
    case actions.UPDATE_PROFILE_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        profileUpdateResponse: {
          type: 'error',
          message: 'Error updating profile',
        },
      });
    case actions.CLEAR_PROFILE_ALERT:
      return Object.assign({}, state, {
        profileUpdateResponse: null,
      });
    case actions.CLEAR_LOGIN_ALERT:
      return Object.assign({}, state, {
        loginResponse: null,
      });
    case actions.FORGOT_REQUEST:
      return Object.assign({}, state, {
        forgotEmail: action.forgotEmail,
      });
    case actions.CLEAR_FORGOT_EMAIL:
      return Object.assign({}, state, {
        forgotEmail: '',
      });
    default:
      return state;
  }
}

function userProfile(state = {
  isFetching: false,
  user: {},
  errorMessage: '',
}, action) {
  switch (action.type) {
    case actions.PROFILE_REQUESTED:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case actions.PROFILE_RECEIVED:
      return Object.assign({}, state, {
        isFetching: false,
        user: action.user,
      });
    default:
      return state;
  }
}

function transactions(state = {
  isFetching: false,
  useAnimation: true,
  items: [],
  errorMessage: '',
  filter: 'PROPOSED',
}, action) {
  switch (action.type) {
    case actions.SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        useAnimation: false,
        filter: action.filter,
      });
    case actions.TRANSACTIONS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        useAnimation: true,
      });
    case actions.TRANSACTIONS_RECEIVED:
      return Object.assign({}, state, {
        isFetching: false,
        useAnimation: true,
        items: action.transactions,
      });
    case actions.UPDATE_TRANSACTION:
      return Object.assign({}, state, {
        useAnimation: true,
        isEditing: true,
      });
    default:
      return state;
  }
}

function requests(state = {
  isSubmitting: false,
  errorMessage: '',
}, action) {
  switch (action.type) {
    case actions.SUBMIT_REQUEST:
      return Object.assign({}, state, {
        isSubmitting: true,
      });
    case actions.CONFIRM_REQUEST_SUBMISSION:
      return Object.assign({}, state, {
        isSubmitting: false,
      });
    default:
      return state;
  }
}

function users(state = {
  isFetching: false,
  errorMessage: '',
  items: null
}, action) {
  switch (action.type) {
    case actions.USERS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case actions.USERS_RECEIVED:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.users,
      });
    default:
      return state;
  }
}

function categories(state = {
  isFetching: false,
  items: []
}, action) {
  switch (action.type) {
    case actions.CATEGORIES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case actions.CATEGORIES_RECEIVED:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.categories,
      });
    default:
      return state;
  }
}

const flattenCategory = (curr, category) =>
  curr.concat(category._skills.map(s => ({
    title: s.label.en,
    category: category.label.en,
    _id: s._id,
  })));

function skills(state = {
  isFetching: false,
  items: []
}, action) {
  switch (action.type) {
    case actions.CATEGORIES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case actions.CATEGORIES_RECEIVED:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.categories.reduce(flattenCategory, [])
      });
    default:
      return state;
  }
}

function contact(state = {
  response: null
}, action) {
  switch (action.type) {
    case actions.CONTACT_SUBMIT_CONFIRMED:
      return Object.assign({}, state, {
        response: action.response,
      });
    case actions.CLEAR_CONTACT_ALERT:
      return Object.assign({}, state, {
        response: null,
      });
    default:
      return state;
  }
}

function onboarding(state = {
  stage: 0,
  title: '',
  skills: [],
  interests: [],
  aboutMeText: '',
  hasStarted: false,
  animate: false,
  searchText: '',
  isNewcomer: null,
}, action) {
  switch (action.type) {
    case actions.STAGE_SELECTED:
      const { index } = action;
      const { skills, interests } = state;
      // Only allow user to progress if she has chosen at least two skills/interests
      if ((index === 2 && skills.length < 2)
            || (index === 1 && interests.length < 2)) {
        return state;
      }
      return Object.assign({}, state, {
        stage: action.index,
        animate: false,
        searchText: '',
      });
    case actions.SKILL_SELECTED:
      if (action.isInterest) {
        if (state.interests.map(s => s._id).indexOf(action.skill._id) < 0) {
          return Object.assign({}, state, {
            interests: state.interests.concat([action.skill]),
            animate: true,
            searchText: '',
          });
        }
      } else if (state.skills.map(s => s._id).indexOf(action.skill._id) < 0) {
        return Object.assign({}, state, {
          skills: state.skills.concat([action.skill]),
          animate: true,
          searchText: '',
        });
      }
      return state;
    case actions.SKILL_REMOVED:
      if (action.isInterest) {
        return Object.assign({}, state, {
          interests: state.interests.filter(s => s._id !== action.skill._id),
          animate: false,
        });
      }
      return Object.assign({}, state, {
        skills: state.skills.filter(s => s._id !== action.skill._id),
        animate: false,
      });
    case actions.ABOUT_ME_CHANGE:
      return Object.assign({}, state, {
        aboutMeText: action.text,
      });
    case actions.ON_START_CLICK:
      return Object.assign({}, state, {
        hasStarted: true,
      });
    case actions.ONBOARDING_SEARCH:
      return Object.assign({}, state, {
        searchText: action.text,
        animate: false,
      });
    case actions.ON_NEWCOMER_SELECT:
      return Object.assign({}, state, {
        isNewcomer: action.isNewcomer,
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
  skills,
});

export default (state, action) => {
  if (action.type === actions.LOGOUT_CONFIRM) {
    state = Object.assign({}, appReducer({}, {}), {
      routing: state.routing,
    });
  }
  return appReducer(state, action);
};
