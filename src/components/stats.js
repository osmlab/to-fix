'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');

var actions = require('../actions/actions');
var StatsStore = require('../stores/stats_store');
var Graph = require('./workspace/dash_graph');
var Header = require('./workspace/dash_heading');

module.exports = React.createClass({
  mixins: [
    Reflux.connect(StatsStore, 'stats')
  ],

  statics: {
    fetchData: function(params) {
      actions.taskStats(params.task);
    }
  },

  render: function() {
    return (
      /* jshint ignore:start */
      <div className='col10 pad2 dark'>
        {this.state.stats ? <Header /> : ''}
        {this.state.stats ? <Graph
          data={this.state.stats} /> : ''}
      </div>
      /* jshint ignore:end */
    );
  }
});
