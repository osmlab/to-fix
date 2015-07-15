'use strict';

var Reflux = require('reflux');

var actions = require('../actions/actions');
var taskServer = require('../mixins/taskserver');

module.exports = Reflux.createStore({
	tasks: {},
	init() {
		this.listenTo(actions.loadTasks, this.loadTasks);
	},
	getInitialState() {
		return this.tasks;
	},
	loadTasks() {
		var self = this;
		var status = false; //false for tasks imcomplete tasks
		tasks: taskServer.get('tasks/' + status, function(err, res) {
			self.tasks = res.tasks
			self.trigger(self.tasks);
		});
	}
});