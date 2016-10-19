import React from 'react';
import Reflux from 'reflux';

import actions from '../actions/actions';
import StatsStore from '../stores/stats_store';
import Graph from './workspace/dash_graph';
import Header from './workspace/dash_heading';
import Table from './workspace/dash_summary';

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
      <div className='col12 clearfix scroll-styled'>
        <div className='col10 pad2 dark'>
          <Header/>
          <Graph data={this.state.stats.data} />
          <Table />
        </div>
      </div>
    );
  }
});

export default Stats;
