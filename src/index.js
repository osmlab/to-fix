// Polyfills
import 'whatwg-fetch';

import React from 'react';
import { render } from 'react-dom';
import qs from 'querystring';
import { Router, hashHistory, RouterContext } from 'react-router';
import Raven from 'raven-js';

import routes from './routes';
import * as config from './config';
import auth from './mixins/auth';
import userStore from './stores/user_store.js';

Raven.config(config.raven, {
  whitelistUrls: ['osmlab.github.io/to-fix/']
}).install();

// Find all routes that require some async 'fetchData' work to be done before
// display, and turn their promises into one promise that works serially.
const doAsync = (routes, params) => {
  return routes
    .filter((route) => route.component.fetchData)
    .reduce(
      (memo, route) => memo.then(route.component.fetchData.bind(this, params)),
      Promise.resolve(true)
    );
}

// Router will rewrite paths it doesn't know including
// the path for OAuth. So check for oauth_token first,
// before initializing the router.
if (window.location.search && !auth.authenticated()) {
  const oauth_token = qs.parse(window.location.search.replace('?', '')).oauth_token;
  auth.bootstrapToken(oauth_token, () => {
    userStore.user = true;
    userStore.trigger(userStore.user);
  });
}

render((
  <Router
    history={hashHistory}
    routes={routes}
    render={(props) => {
      doAsync(props.routes, props.params).then();
      return <RouterContext {...props} />;
    }}
  />
), document.getElementById('app'));
