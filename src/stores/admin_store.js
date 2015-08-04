var Reflux = require('reflux');
var actions = require('../actions/actions');

var taskServer = require('../mixins/taskserver');
var emitError = require('../mixins/error');
var config = require('../config');

var admin_store = Reflux.createStore({
	task: [],
	init: function() {
		this.listenTo(actions.getTask, this.getTask);
	},
	getInitialState: function() {
		return this.task;
	},

	getTask: function(task) {
		taskServer.get('detail/' + task, function(err, res) {
			if (err) return emitError(err);
			this.task = res;
			this.trigger(this.task);
		}.bind(this));

	}
});

module.exports = admin_store;