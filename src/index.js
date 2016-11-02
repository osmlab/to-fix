// Polyfills
import 'whatwg-fetch';

import React from 'react';
import { render } from 'react-dom';
// import qs from 'querystring';
import { Router, hashHistory } from 'react-router';
import Raven from 'raven-js';

import routes from './routes';
import * as config from './config';

import { Provider } from 'react-redux';
import configureStore from './configureStore';

Raven.config(config.raven, {
  whitelistUrls: ['osmlab.github.io/to-fix/']
}).install();

const store = configureStore();

render((
  <Provider store={store}>
    <Router
      history={hashHistory}
      routes={routes}
    />
  </Provider>
), document.getElementById('app'));
