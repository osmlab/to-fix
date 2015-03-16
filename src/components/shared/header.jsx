'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      /* jshint ignore:start */
      <header className='fill-orange row-60 col12 clearfix'>
        <nav className='col3'>
          <a href='#' className='js-sidebar-toggle sidebar-toggle quiet block fl keyline-right animate pad1 row-60'>
            <span className='icon big menu'></span>
          </a>
          <a href='/' className='pad2x'>
            <h1 className='inline fancy title'>to-fix</h1>
          </a>
        </nav>
        <div className='col9 text-right pad1'>
          <nav className='js-mode-controls col12 text-right space pad0y'>
            <a href='#' data-mode='map' className='js-mode icon pencil active animate short button'>Task</a>
            <a href='#' data-mode='activity' className='js-mode icon bolt button short animate'>Activity</a>
            <a href='#' data-mode='stats' className='js-mode icon graph button short animate'>Statistics</a>
          </nav>
        </div>
      </header>
      /* jshint ignore:end */
    );
  }
});
