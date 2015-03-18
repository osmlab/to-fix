'use strict';

var React = require('react');
var Router = require('react-router');
var taskObj = require('../../mixins/task-item');
var actions = require('../../actions/actions');
var Keys = require('react-keybinding');

module.exports = React.createClass({
  mixins: [
    Router.State,
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
    actions.taskEdit();
  },

  skip: function() {
    actions.taskData(this.getParams().task);
  },

  fixed: function() {
    actions.taskDone(this.getParams().task);
  },

  render: function() {
    var taskTitle = taskObj(this.getParams().task).title;
    return (
      /* jshint ignore:start */
      <div className='editbar pin-bottomleft col12 pad4 z1'>
        <div className='dark round col6 margin3'>
          <nav id='actions' className='tabs col12 clearfix'>
            <button onClick={this.edit} className='fill-darken3 col4 animate unround'>Edit</button>
            <button onClick={this.skip} className='fill-darken3 col4 animate'>Skip</button>
            <button onClick={this.fixed} className='fill-darken3 col4 animate'>Fixed</button>
          </nav>
          <div className='fill-darken1 round-bottom col12 pad2x pad1y center strong inline'>
            {taskTitle}
          </div>
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});
