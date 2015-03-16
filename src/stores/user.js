'use strict';

var Reflux = require('reflux');
var actions = require('../actions/actions');
var auth = require('../mixins/auth');

module.exports = Reflux.createStore({
  user: null,
  init: function() {
    this.user = auth.authenticated();
    this.listenTo(actions.userLogin, this.login);
  },
  getInitialState: function() {
    return this.user;
  },
  login: function() {
    auth.authenticate(function(err, details) {
      this.user = auth.authenticated();
      this.trigger(this.user);
    });
  }
});
