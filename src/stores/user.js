'use strict';

var Reflux = require('reflux');
var store = require('store');
var actions = require('../actions/actions');
var auth = require('../mixins/auth');

module.exports = Reflux.createStore({
  user: {},
  init: function() {
    var _this = this;
    this.user.auth = auth.authenticated();
    if (store.get('osmid')) {
      this.user.id = store.get('osmid');
      this.user.username = store.get('username');
      this.user.avatar = store.get('avatar');
    } else {
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

      });
    }
    this.listenTo(actions.userLogin, this.login);
    this.listenTo(actions.userLogout, this.logout);
  },

  getInitialState: function() {
    return this.user;
  },

  login: function() {
    auth.authenticate(function(err) {
      if (err) return console.error(err);
      this.user.auth = auth.authenticated();
      this.trigger(this.user);
    });
  },

  logout: function() {
    auth.logout();
  }
});
