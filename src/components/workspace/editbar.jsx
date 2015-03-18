'use strict';

var React = require('react');
var Router = require('react-router');
var taskObj = require('../../mixins/task-item');

module.exports = React.createClass({
  mixins: [
    Router.State,
    taskObj
  ],

  render: function() {
    var taskTitle = taskObj(this.getParams().task).title;
    return (
      /* jshint ignore:start */
      <div id='editbar' className='pin-topleft pad1 z1'>
        <div className='fill-darken3 dark round'>
          <span className='pad2x strong quiet inline'>{taskTitle}</span>
          <nav id='actions' className='fill-darken0 round-right tabs short'>
            <a href='#' id='edit' className='animate unround'>Edit</a>
            <a href='#' id='skip' className='keyline-left animate'>Skip</a>
            <a href='#' id='fixed' className='keyline-left animate'>Fixed</a>
          </nav>
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});
