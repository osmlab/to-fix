'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;

var actions = require('../actions/actions');
var Admin_store = require('../stores/admin_store');
var Addtask = require('./admin/add_task');
var Showtask = require('./admin/show_task');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      show_task_window: true,
      add_task_window: null
    };
  },
  statics: {
    fetchData: function(params) {
      actions.getTask(params.task);
    }
  },
  openShow_task: function() {
    this.setState({
      add_task_window: false,
      show_task_window: true
    });
  },
  openAdd_task: function() {
    this.setState({
      add_task_window: true,
      show_task_window: false
    });
  },

  render: function() {
    var url_add = '/admin/add';
    return (
        <div className='col12 clearfix scroll-styled'>
          <div className='col6 pad2 dark'>
           {(this.state.show_task_window) ? (<Showtask />) : ''}
           {(this.state.add_task_window) ? (<Addtask />) : ''}
          </div>
            <div className='col6 pad2 dark'>
            <div className='pill'>
              <a  onClick={this.openShow_task} className='button pad2x quiet'>Edit this task</a>
              <Link onClick={this.openAdd_task} className='button pad2x quiet' to={url_add}>Add a task</Link>
            </div>
          </div>
        </div>  
    );

  }
});