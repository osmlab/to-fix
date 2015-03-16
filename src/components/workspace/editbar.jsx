'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      /* jshint ignore:start */
      <div id='editbar' className='pin-topleft pad1 z1'>
        <div className='fill-darken3 dark round'>
          <span className='pad2x strong quiet inline'>Task Name</span>
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
