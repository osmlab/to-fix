'use strict';

var Reflux = require('reflux');
var store = require('store');
var actions = require('../actions/actions');
var auth = require('../mixins/auth');

module.exports = Reflux.createStore({
  user: {},
  init: function() {
    this.user = {
      auth: auth.authenticated(),
      id: store.get('osmid'),
      username: store.get('username'),
      avatar: store.get('avatar')
    };
    this.listenTo(actions.userLogin, this.login);
    this.listenTo(actions.userLogout, this.logout);
  },

  getInitialState: function() {
    return this.user;
  },

  login: function() {
    var _this = this;
    auth.authenticate(function(err) {
      if (err) return console.error(err);
      auth.xhr({
        method: 'GET',
        path: '/api/0.6/user/details'
      }, function(err, details) {
        if (err) return console.error(err);
        details = details.getElementsByTagName('user')[0];
        var id = store.set('osmid', details.getAttribute('id')),
          username = store.set('username', details.getAttribute('display_name')),
          avatar = store.set('avatar', details.getElementsByTagName('img')[0].getAttribute('href'));

        _this.user = {
          auth: auth.authenticated(),
          id: store.get('osmid'),
          username: store.get('username'),
          avatar: store.get('avatar')
        };
        _this.trigger(_this.user);
      });
    });
  },

  logout: function() {
    auth.logout();
    this.user = {};
    this.trigger(this.user);
  }
});
