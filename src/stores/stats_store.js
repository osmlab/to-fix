'use strict';

var Reflux = require('reflux');
var d3 = require('d3');

var actions = require('../actions/actions');
var taskServer = require('../mixins/taskserver');
var emitError = require('../mixins/error');
var config = require('../config');

// When the task server began recording.
var HISTORICAL_START = '2015-03-20';

module.exports = Reflux.createStore({
  stats: {},

  init: function() {
    this.listenTo(actions.taskStats, this.taskStats);
    this.listenTo(actions.taskTotals, this.taskTotals);
    this.listenTo(actions.statSummaries, this.statSummaries);
  },

  getInitialState: function() {
    return this.stats;
  },

  statSummaries: function(task, extent) {
    taskServer.get('track_stats/' + task + '/from:' + extent[0] + '/to:' + extent[1], function(err, res) {
      if (err) emitError(err);
      this.stats.summaries = res.stats.map(function(stat) {
        stat.total = 0;
        if (stat.edit) stat.total += stat.edit;
        if (stat.fix) stat.total += stat.fix;
        if (stat.skip) stat.total += stat.skip;
        if (stat.noterror) stat.total += stat.noterror;
        return stat;
      }).sort(function(a, b) {
        return b.total - a.total;
      });

      this.trigger(this.stats);
    }.bind(this));
  },

  taskStats: function(task) {
    // Get the total number count of task items
    taskServer.get('count/' + task, function(err, res) {
      if (err) return emitError(err);

      taskServer.get('count_history/' + task + '/day', function(err, r) {
        if (err) return emitError(err);
        this.stats.data = r.data.sort(function(a, b) {
          // Sort earliest to latest.
          return a.start - b.start;
        });

        this.stats.totals = res;
        this.trigger(this.stats);
      }.bind(this));
    }.bind(this));
  }
});
