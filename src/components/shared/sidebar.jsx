'use strict';

var React = require('react');
var Reflux = require('reflux');
var taskItems = require('../../data/tasks.json').tasks;
var LogIn = require('./login.jsx');

module.exports = React.createClass({
  render: function() {
    var tasks = taskItems.map(function(task, i) {
      return (
        /* jshint ignore:start */
        <a href='#' className='block strong dark pad1x pad0y truncate' key={i}>{task.title}</a>
        /* jshint ignore:end */
      );
    });

    return (
      /* jshint ignore:start */
      <div className='sidebar pin-bottomleft clip col2 animate offcanvas-left fill-navy space-top6 active'>
        <div className='scroll-styled pad2y'>
          <LogIn />
          <span className='dark block pad1x space-bottom1'>Tasks</span>
          <nav ref='taskList' className='space-bottom2'>{tasks}</nav>
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});
