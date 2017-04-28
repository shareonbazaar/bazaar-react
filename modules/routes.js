import React from 'react'
import App from './App'
import Community from './Community'
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

    function Home () {
      if (store.getState().auth.isAuthenticated) {
        return <Community />
      }
      return <Splash />
    }

    return (
      <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="login" component={Login} onEnter={bypassAuth} />
          <Route path="signup" component={Signup} onEnter={bypassAuth} />
          <Route path="transactions" component={VisibleTransactionList} onEnter={requireAuth} />
          <Route path="profile/:id" component={Profile} onEnter={requireAuth} />
          <Route path="editprofile" component={EditProfile} onEnter={requireAuth} />
          <Route path="contact" component={Contact} />
          <Route path="settings" component={Settings} onEnter={requireAuth} />
      </Route>
    )
}
