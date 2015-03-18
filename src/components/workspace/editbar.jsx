'use strict';

var React = require('react');
var Router = require('react-router');
var taskObj = require('../../mixins/task-item');
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
    console.log('edit');
  },

  skip: function() {
    console.log('skip');
  },

  fixed: function() {
    console.log('fixed');
  },

  render: function() {
    var taskTitle = taskObj(this.getParams().task).title;
    return (
      /* jshint ignore:start */
      <div className='editbar pin-bottomleft col12 pad4 z1'>
        <div className='dark round col6 margin3'>
          <nav id='actions' className='fill-darken3 round-top tabs col12 clearfix'>
            <button onClick={this.edit} className='col4 animate unround'>Edit</button>
            <button onClick={this.skip} className='col4 animate'>Skip</button>
            <button onClick={this.fixed} className='col4 animate'>Fixed</button>
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
