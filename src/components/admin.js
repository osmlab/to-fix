'use strict';

var React = require('react');

var actions = require('../actions/actions');
var Addtask = require('./admin/add_task');
var Showtask = require('./admin/show_task');
var Edittask = require('./admin/edit_task');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      show_task_window: true,
      add_task_window: false,
      edit_task_window: false
    };
  },
  statics: {
    fetchData: function(params) {
      actions.getTask(params.task);
    }
  },
  openShow_task: function() {
    this.setState({
      show_task_window: true,
      add_task_window: false,
      edit_task_window: false
    });
  },
  openAdd_task: function() {
    this.setState({
      show_task_window: false,
      add_task_window: true,
      edit_task_window: false
    });
  },
  openEdit_task: function() {
    this.setState({
      show_task_window: false,
      add_task_window: false,
      edit_task_window: true
    });
  },
  render: function() {
    return (
        <div className='col12 clearfix scroll-styled'>
          <div className='col6 pad2 dark'>
           {(this.state.show_task_window) ? (<Showtask />) : ''}
           {(this.state.add_task_window) ? (<Addtask />) : ''}
           {(this.state.edit_task_window) ? (<Edittask />) : ''}
          </div>
            <div className='col6 pad2 dark'>
            <div className='pill'>
              <a onClick={this.openShow_task} className='button pad2x quiet'>Show detail</a>
              <a onClick={this.openEdit_task} className='button pad2x quiet'>Edit this task</a>
              <a onClick={this.openAdd_task} className='button pad2x quiet'>Add a task</a>
            </div>
          </div>
        </div>
    );
  }
});