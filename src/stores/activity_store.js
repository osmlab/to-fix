'use strict';

var Reflux = require('reflux');
var d3 = require('d3');

var actions = require('../actions/actions');
var emitError = require('../mixins/error');
var taskServer = require('../mixins/taskserver');

module.exports = Reflux.createStore({
  activity: [],

  init: function() {
    this.listenTo(actions.taskActivity, this.taskActivity);
  },

  getInitialState: function() {
    return this.activity;
  },

  taskActivity: function(task) {
    var dateFormat = d3.time.format('%Y-%m-%d');
    var from = dateFormat(d3.time.day.offset(new Date(), -7));
    var to = dateFormat(new Date());
    var dates = '/from:' + from + '/to:' + to;

    taskServer.get('track/' + task + dates, function(err, res) {
      if (err) return emitError(err);
      this.activity = res.data.reverse();
      this.trigger(this.activity);
      actions.taskActivityLoaded();
    }.bind(this));
  }
});
