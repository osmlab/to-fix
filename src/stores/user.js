'use strict';

var Reflux = require('reflux');
var actions = require('../actions/actions');
var auth = require('../mixins/auth');

module.exports = Reflux.createStore({
  user: {},
  init: function() {
    this.user.auth = auth.authenticated();
    this.listenTo(actions.userLogin, this.login);
    this.listenTo(actions.userLogout, this.logout);
  },

  getInitialState: function() {
    return this.user;
  },

  login: function() {
    var _this = this;
    auth.authenticate(function(err) {
      auth.xhr({
        method: 'GET',
        path: '/api/0.6/user/details'
      }, function(err, details) {
        // TODO Handle this error
        if (err) return console.error(err);
        details = details.getElementsByTagName('user')[0];
        _this.user = {
          auth: auth.authenticated(),
          id: details.getAttribute('id'),
          username: details.getAttribute('display_name'),
          avatar: details.getElementsByTagName('img')[0].getAttribute('href')
        };
        _this.trigger(_this.user);
      });
    });
  },

  logout: function() {
    auth.logout();
  }
});
