import React from 'react'
import App from './App'
import { Community, Bookmarks } from './CommunityContainer'
import Splash from './Splash'
import VisibleTransactionList from './VisibleTransactionList'
import Profile from './Profile'
import EditProfile from './EditProfile'
import Contact from './Contact'
import Settings from './Settings'
import { Login, Signup } from './Authentication'

import { Route, IndexRoute } from 'react-router'

export default (store) => {
    // validate authentication for private routes
    const requireAuth = (nextState, replace) => {
      if (!store.getState().auth.isAuthenticated) {
        replace({pathname: '/login', state: {redirect: nextState.location}})
      }
    }

    const bypassAuth = (nextState, replace) => {
      if (store.getState().auth.isAuthenticated) {
        replace({pathname: '/'});
      }
    }

    function AppContainer (props) {
      if (!(store.getState().auth.isAuthenticated) && props.location.pathname == '/') {
        return <Splash />
      }
      return <App children={props.children} location={props.location} />
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
          <Route path="bookmarks" component={Bookmarks} />
          <Route path="settings" component={Settings} onEnter={requireAuth} />
      </Route>
    )
}
