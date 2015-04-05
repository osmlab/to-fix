'use strict';

var Reflux = require('reflux');
var store = require('store');
var actions = require('../actions/actions');
var postToTaskServer = require('../mixins/taskserver').postForm;

module.exports = Reflux.createStore({

  settings: {},

  init: function() {
    var sidebar = store.get('sidebar');
    this.settings.sidebar = sidebar ? true : false;
    this.listenTo(actions.sidebarToggled, this.toggle);
    this.listenTo(actions.editorPreference, this.setEditorPreference);
    this.listenTo(actions.uploadTasks, this.uploadTasks);
  },

  getInitialState: function() {
    return this.settings;
  },

  setEditorPreference: function(editor) {
    store.set('editor', editor);
  },

  uploadTasks: function(data) {
    postToTaskServer('csv', data, function(err, res) {
      if (err) return console.error(err);
      window.location.hash = 'task/' + res.internalName;
    });
  },

  toggle: function() {
    if (store.get('sidebar')) {
      store.remove('sidebar');
      this.settings.sidebar = false;
    } else {
      store.set('sidebar', true);
      this.settings.sidebar = store.get('sidebar');
    }

    this.trigger(this.settings);
  }
});
