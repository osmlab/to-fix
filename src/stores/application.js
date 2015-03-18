'use strict';

var Reflux = require('reflux');
var store = require('store');
var actions = require('../actions/actions');

module.exports = Reflux.createStore({

  settings: {},

  init: function() {
    var sidebar = store.get('sidebar');
    this.settings.sidebar = sidebar ? true : false;
    this.listenTo(actions.sidebarToggled, this.toggle);
    this.listenTo(actions.editorPreference, this.setEditorPreference);
  },

  getInitialState: function() {
    return this.settings;
  },

  setEditorPreference: function(editor) {
    store.set('editor', editor);
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
