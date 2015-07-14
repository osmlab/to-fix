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
		tasks: taskServer.get('tasks', function(err, res) {
			console.log(res.tasks)
			self.tasks = res.tasks
			self.trigger(self.tasks);
		});
	}
});