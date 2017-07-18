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

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import ar from 'react-intl/locale-data/ar';
import localeData from './locales/data.json';

addLocaleData([...en, ...de, ...ar]);

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage;

// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

// Try full locale, fallback to locale without region code, fallback to en
const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

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
        <IntlProvider locale={language} messages={messages}>
            <Provider store={store}>
                <Router routes={routes(store)} history={history}>
                </Router>
            </Provider>
        </IntlProvider>
        ), document.getElementById('root'));
})

