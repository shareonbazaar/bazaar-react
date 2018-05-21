import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App/App';
import { UserSearch, Bookmarks } from './UserSearch/UserSearch';
import Splash from './Splash/Splash';
import VisibleTransactionList from './VisibleTransactionList/VisibleTransactionList';
import Profile from './Profile/Profile';
import EditProfile from './EditProfile/EditProfile';
import Contact from './Contact/Contact';
import Settings from './Settings/Settings';
import Terms from './Legal/Terms';
import Imprint from './Legal/Imprint';

import Login from './Authentication/Login';
import Signup from './Authentication/Signup';
import Forgot from './Authentication/Forgot';
import Onboarding from './Onboarding/Container';
import ManageSkills from './ManageSkills/Container';
import Community from './Community/Container';

function NotFound() {
  return (
    <div className="empty-transaction-list">
      <p>There&apos;s nothing here. This is a 404 page</p>
    </div>
  );
}

export default (store) => {
  // validate authentication for private routes
  const requireAuth = (nextState, replace) => {
    if (!store.getState().auth.isAuthenticated) {
      replace({ pathname: '/login', state: { redirect: nextState.location } });
    }
  };

  const requireAdmin = (nextState, replace) => {
    const state = store.getState();
    if (!state.auth.isAuthenticated || !state.auth.user.isAdmin) {
      replace({ pathname: '/' });
    }
  };

  const bypassAuth = (nextState, replace) => {
    if (store.getState().auth.isAuthenticated) {
      replace({ pathname: '/' });
    }
  };

  function AppContainer(props) {
    // eslint-disable-next-line
    const { children, location } = props;
    if (!(store.getState().auth.isAuthenticated) && location.pathname === '/') {
      return <Splash />;
    }
    // eslint-disable-next-line
    return <App children={children} location={location} />;
  }


  return (
    <Route path="/" component={AppContainer}>
      <IndexRoute component={UserSearch} />
      <Route path="login" component={Login} onEnter={requireAdmin} />
      <Route path="forgot" component={Forgot} onEnter={requireAdmin} />
      <Route path="reset/:id" component={Forgot} onEnter={requireAdmin} />
      <Route path="signup" component={Signup} onEnter={requireAdmin} />
      <Route path="users" component={UserSearch} onEnter={requireAdmin} />
      <Route path="community" component={Community} onEnter={requireAdmin} />
      <Route path="transactions" component={VisibleTransactionList} onEnter={requireAdmin} />
      <Route path="profile/:id" component={Profile} onEnter={requireAdmin} />
      <Route path="editprofile" component={EditProfile} onEnter={requireAdmin} />
      <Route path="contact" component={Contact} onEnter={requireAdmin} />
      <Route path="terms" component={Terms} />
      <Route path="bookmarks" component={Bookmarks} onEnter={requireAdmin} />
      <Route path="settings" component={Settings} onEnter={requireAdmin} />
      <Route path="onboarding" component={Onboarding} onEnter={requireAdmin} />
      <Route path="terms" component={Terms} onEnter={requireAdmin} />
      <Route path="imprint" component={Imprint} />
      <Route path="/admin/skills" component={ManageSkills} onEnter={requireAdmin} />
      <Route path="*" component={NotFound} />
    </Route>
  );
};
