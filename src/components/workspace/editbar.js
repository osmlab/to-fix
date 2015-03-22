'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var taskObj = require('../../mixins/task-item');
var actions = require('../../actions/actions');
var UserStore = require('../../stores/user_store');
var Keys = require('react-keybinding');

module.exports = React.createClass({
  mixins: [
    Router.State,
    Reflux.connect(UserStore, 'user'),
    Reflux.listenTo(actions.geolocated, 'geolocate'),
    taskObj,
    Keys
  ],

  keybindings: {
    'e': function() {
      this.edit();
    },
    's': function() {
      this.skip();
    },
    'f': function() {
      this.fixed();
    }
  },

  edit: function() {
    actions.taskEdit(this.getParams().task);
  },

  skip: function() {
    var task = this.getParams().task;
    actions.taskData(task);
    actions.taskSkip(task);
  },

  fixed: function() {
    actions.taskDone(this.getParams().task);
  },

  geolocate: function(placename) {
    this.setState({
      placename: placename
    });
  },

  render: function() {
    var taskTitle = taskObj(this.getParams().task).title;
    var taskActions = (
      /* jshint ignore:start */
      <nav className='tabs col12 clearfix'>
        <a onClick={this.skip} className='col12 animate icon refresh'>Preview another task</a>
      </nav>
      /* jshint ignore:end */
    );

    if (this.state.user && this.state.user.auth) {
      taskActions = (
        /* jshint ignore:start */
        <nav className='tabs col12 clearfix mobile-cols'>
          <button onClick={this.edit} className='col4 animate unround'>Edit</button>
          <button onClick={this.skip} className='col4 animate'>Skip</button>
          <button onClick={this.fixed} className='col4 animate'>Fixed</button>
        </nav>
        /* jshint ignore:end */
      );
    }

    return (
      /* jshint ignore:start */
      <div className='editbar pin-bottomleft col12 pad4 z1'>
        <div className='round col6 margin3'>
          {taskActions}
          <div className='fill-lighten3 round-bottom col12 pad2x pad1y center strong inline truncate'>
            {taskTitle} {this.state.placename ? <span className='quiet icon marker'>{this.state.placename}</span> : ''}
          </div>
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});
