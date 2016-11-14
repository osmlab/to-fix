// Polyfills
import 'whatwg-fetch';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';

import routes from './routes';
import store from './stores/store';

render((
  <Provider store={store}>
    <Router
      history={hashHistory}
      routes={routes}
    />
  </Provider>
), document.getElementById('app'));
