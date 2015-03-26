'use strict';

var Reflux = require('reflux');

var actions = Reflux.createActions({
  // Authentication based actions
  'userLogin': {},
  'userLogout': {},

  // Map state
  'baseLayerChange': {},
  'geolocated': {},

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
  'taskDone': {},
  'taskActivity': {},
  'taskActivityLoaded': {},
  'taskTotals': {},

  'statSummaries': {},
  'updatePermalink': {},

  // common buttons
  'taskSkip': {}
});

module.exports = actions;
