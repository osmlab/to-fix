'use strict';

var Reflux = require('reflux');
var xhr = require('xhr');
var actions = require('../actions/actions');
var emitError = require('../mixins/error');
var taskServer = require('../mixins/taskserver');
var periodFilter = require('../data/period_filtering')

module.exports = Reflux.createStore({
  activity: [],

  init: function() {
    this.listenTo(actions.taskActivity, this.taskActivity);
  },

  getInitialState: function() {
    return this.activity;
  },

  taskActivity: function(task, period) {
    // Pull from/to dates based on period passed.
    var dates = periodFilter[period];
    dates = '/from:' + dates[0] + '/to:' + dates[1];
    taskServer.get('track/' + task + dates, function(err, res) {
      if (err) return emitError(err);
      this.activity = res.data.reverse();
      this.trigger(this.activity);
      actions.taskActivityLoaded();
    }.bind(this));
  }
});
