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
  'editorPreference': {},

  // Application management
  'uploadTasks': {},

  // Modals
  'openSettings': {},
  'openUpload': {},

  // Dialogs
  'errorDialog': {},

  // Dashboard
  'graphUpdated': {},

  // to-fix task data
  'taskEdit': {},
  'taskData': {},
  'taskStats': {},
  'taskDone': {}
});

module.exports = actions;
