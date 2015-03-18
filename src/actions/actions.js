'use strict';

var Reflux = require('reflux');

var actions = Reflux.createActions({
  // Authentication based actions
  'userLogin': {},
  'userLogout': {},

  // Map state
  'baseLayerChange': {},

  // Application settings
  'sidebarToggled': {},

  // Manages to-fix tasks
  'taskEdit': {},
  'taskData': {},
  'taskDone': {}
});

module.exports = actions;
