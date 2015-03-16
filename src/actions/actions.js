'use strict';

var Reflux = require('reflux');

var actions = Reflux.createActions([
  // Authentication based actions
  'userLogin',
  'userLogout',

  // Application settings
  'sidebarToggled'
]);

module.exports = actions;
