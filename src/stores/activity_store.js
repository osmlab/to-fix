'use strict';

var Reflux = require('reflux');
var xhr = require('xhr');
var actions = require('../actions/actions');
var emitError = require('../mixins/error');
var config = require('../config');

module.exports = Reflux.createStore({
  stats: [],

  init: function() {
    this.listenTo(actions.taskStats, this.taskStats);
  },

  getInitialState: function() {
    return this.stats;
  },

  taskStats: function(task) {
    var _this = this;

    xhr({
      uri: 'http://localhost:3000/src/data/testdata.json'
    }, function(err, res) {
      if (err) return emitError(err);
      _this.stats = JSON.parse(res.body);
      _this.trigger(_this.stats);
    });
  }
});
