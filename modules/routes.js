import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App/App';
import { Community, Bookmarks } from './CommunityContainer/CommunityContainer';
import Splash from './Splash/Splash';
import VisibleTransactionList from './VisibleTransactionList/VisibleTransactionList';
import Profile from './Profile/Profile';
import EditProfile from './EditProfile/EditProfile';
import Contact from './Contact/Contact';
import Settings from './Settings/Settings';
import Terms from './Terms/Terms';

import Login from './Authentication/Login';
import Signup from './Authentication/Signup';
import Forgot from './Authentication/Forgot';
import Onboarding from './Onboarding/Container';


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
      <Route path="forgot" component={Forgot} />
      <Route path="reset/:id" component={Forgot} />
      <Route path="signup" component={Signup} onEnter={bypassAuth} />
      <Route path="transactions" component={VisibleTransactionList} onEnter={requireAuth} />
      <Route path="profile/:id" component={Profile} onEnter={requireAuth} />
      <Route path="editprofile" component={EditProfile} onEnter={requireAuth} />
      <Route path="contact" component={Contact} />
      <Route path="terms" component={Terms} />
      <Route path="bookmarks" component={Bookmarks} />
      <Route path="settings" component={Settings} onEnter={requireAuth} />
      <Route path="onboarding" component={Onboarding} />
    </Route>
  );
};
