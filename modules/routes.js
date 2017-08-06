import React from 'react';
// import PropTypes from 'prop-types';
import { Route, IndexRoute } from 'react-router';
import App from './App';
import Community from './Community';
import Splash from './Splash';
import VisibleTransactionList from './VisibleTransactionList';
import Profile from './Profile';
import Contact from './Contact';
import Settings from './Settings';
import EditProfile from './EditProfile';
import { Login, Signup } from './Authentication';


export default (store) => {
  // validate authentication for private routes
  const requireAuth = (nextState, replace) => {
    if (!store.getState().auth.isAuthenticated) {
      replace({ pathname: '/login', state: { redirect: nextState.location } });
    }
  };

  const bypassAuth = (nextState, replace) => {
    if (store.getState().auth.isAuthenticated) {
      replace({ pathname: '/' });
    }
  };

  function AppContainer(props) {
    //eslint-disable-next-line
    const { children, location } = props;
    if (!(store.getState().auth.isAuthenticated) && location.pathname === '/') {
      return <Splash />;
    }
    //eslint-disable-next-line
    return <App children={children} location={location} />;
  }

  return (
    <Route path="/" component={AppContainer}>
      <IndexRoute component={Community} />
      <Route path="login" component={Login} onEnter={bypassAuth} />
      <Route path="signup" component={Signup} onEnter={bypassAuth} />
      <Route path="transactions" component={VisibleTransactionList} onEnter={requireAuth} />
      <Route path="profile/:id" component={Profile} onEnter={requireAuth} />
      <Route path="editprofile" component={EditProfile} onEnter={requireAuth} />
      <Route path="contact" component={Contact} />
      <Route path="settings" component={Settings} onEnter={requireAuth} />
    </Route>
  );
};
