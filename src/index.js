'use strict';

window.React = require('react');

var Reflux = require('reflux');
var qs = require('querystring');

var Router = require('react-router');
var Routes = require('./routes');
var config = require('./config');
var auth = require('./mixins/auth');
var Loader = require('./components/shared/loader');
var Raven = require('raven-js');

var userStore = require('./stores/user.js');

Raven.config(config.raven).install();

function doAsync(routes, params) {
  var _this = this;

  // Find all routes that require some async 'fetchData' work to be done before
  // display, and turn their promises into one promise that works serially.
  return routes.filter(function(route) {
    return route.handler.fetchData;
  }).reduce(function(memo, route) {
    return memo.then(route.handler.fetchData.bind(_this, params));
  }, Promise.resolve(true));
}

var router = Router.create({
  scrollBehavior: false,
  routes: Routes
});

// Main initial elements
var el = document.getElementById('app');
var loader = document.getElementById('loader');

// Router will rewrite paths it doesn't know including
// the path for OAuth. So check for oauth_token first.
// before initializing the router.
if (window.location.search && !auth.authenticated()) {
  var oauth_token = qs.parse(window.location.search.replace('?', '')).oauth_token;
  auth.bootstrapToken(oauth_token, function(err, res) {
    userStore.user = true;
    userStore.trigger(userStore.user);
    router.run(function(Handler) {
      /* jshint ignore:start */
      React.render(<Handler/>, el);
      /* jshint ignore:end */
    });
  });
} else {
  router.run(function(Handler, state) {
    /* jshint ignore:start */
    React.render(<Loader loading={true}/>, loader);
    doAsync(state.routes, state.params).then(function() {
      React.render(<Loader loading={false}/>, loader);
      React.render(<Handler />, el);
    }, function(err) {
      throw err;
    }).catch(function(e) {
      console.error(e);
    });
    /* jshint ignore:end */
  });
}
