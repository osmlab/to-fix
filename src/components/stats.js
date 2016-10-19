'use strict';

var React = require('react');
var Reflux = require('reflux');

var actions = require('../actions/actions');
var StatsStore = require('../stores/stats_store');
var Graph = require('./workspace/dash_graph');
var Header = require('./workspace/dash_heading');
var Table = require('./workspace/dash_summary');

const Stats = React.createClass({
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
      <div className='col12 clearfix scroll-styled'>
        <div className='col10 pad2 dark'>
          <Header/>
          <Graph data={this.state.stats.data} />
          <Table />
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});

export default Stats;
