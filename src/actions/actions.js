'use strict';

var Reflux = require('reflux');
var xhr = require('xhr');
var tasks = require('../data/tasks.json').tasks;

var actions = Reflux.createActions({
  // Authentication based actions
  'userLogin': {},
  'userLogout': {},

  // Map state
  'map': {},

  // Application settings
  'sidebarToggled': {},

  // Manages to-fix source types
  'source': {
    'load': function(type) {
      // load source based on type
      // Filter type out of `tasks`
    }
  }
});

module.exports = actions;
