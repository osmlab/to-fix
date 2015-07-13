var Reflux = require('reflux');
var _ = require('lodash');
var actions = require('../actions/actions');

var taskServer = require('../mixins/taskserver');
var emitError = require('../mixins/error');
var config = require('../config');

var admin_store = Reflux.createStore({
	task: [],
	init: function() {
		this.listenTo(actions.getTasks, this.getTasks);
		// this.listenTo(actions.addTask, this.addTask);
		// this.listenTo(actions.updateTask, this.toggle);
	},
	getInitialState: function() {
		return this.task;
	},

	getTasks: function(task) {
		taskServer.get('detail/' + task, function(err, res) {
			if (err) return emitError(err);
			this.task = res;
			this.trigger(this.task);
		}.bind(this));

	},

	addTask: function(task) {
		_tasks.push(task);
	},


	toggle: function(idTask) {
		var task = _.where(_tasks, {
			'id': idTask
		})[0];
		// toggle the banner status in the obect
		task.active = task.active === 'Yes' ? 'No' : 'Yes';
		// pass the data on to any listeners -- see updateTask in view.js)
		this.trigger();
	}

});

module.exports = admin_store;