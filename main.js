import './public/css/style.css';

import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'

import { persistStore, autoRehydrate } from 'redux-persist'

import routes from './modules/routes'
import reducers from './utils/reducers'

const store = createStore(
    reducers,
    {},
    compose(
        applyMiddleware(thunkMiddleware, routerMiddleware(browserHistory)),
        autoRehydrate()
    )
)

// Delay render until state has loaded from localStorage
persistStore(store, {blacklist: ['routing']}, () => {
    const history = syncHistoryWithStore(browserHistory, store);

    render((
        <Provider store={store}>
            <Router routes={routes(store)} history={history}>
            </Router>
        </Provider>
        ), document.getElementById('root'));
})

