'use strict';

var Reflux = require('reflux');

var actions = require('../actions/actions');
var taskServer = require('../mixins/taskserver');

module.exports = Reflux.createStore({
	tasks: {},
	init: function() {
		this.listenTo(actions.loadTasks, this.loadTasks);
	},
	getInitialState: function() {
		return this.tasks;
	},
	loadTasks: function() {
		var self = this;
		//var status = false; //false for tasks imcomplete tasks
		tasks: taskServer.get('tasks', function(err, res) {
			self.tasks = res.tasks
			self.trigger(self.tasks);
		});
	}
});