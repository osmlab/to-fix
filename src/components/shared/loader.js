'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function() {
    /* jshint ignore:start */
    return (
      <div className={this.props.loading ? 'loading' : ''}></div>
    );
    /* jshint ignore:end */
  }
});
