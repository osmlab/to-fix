'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var actions = require('../actions/actions');
var taskObj = require('../mixins/taskobj');
var StatsStore = require('../stores/stats_store');
var Graph = require('./workspace/graph');

module.exports = React.createClass({
  mixins: [
    Reflux.connect(StatsStore, 'stats'),
    Reflux.listenTo(actions.graphUpdated, 'graphUpdated'),
    Router.State,
    taskObj
  ],

  statics: {
    fetchData: function(params) {
      actions.taskStats(params.task);
    }
  },

  getInitialState: function() {
    return {
      extent: null,
      totals: {
        'total': 5096,
        'available': 3646
      }
    };
  },

  graphUpdated: function(from, to) {
    // Revise the date title
    if (from === to) {
      this.setState({ extent: [to] });
    } else {
      this.setState({ extent: [from, to] });
    }
  },

  render: function() {
    var taskTitle = taskObj(this.getParams().task).title;
    var available = this.state.totals.available;
    var total = this.state.totals.total;
    var completed = total - available;
    var progressStyle = {
      width: (completed / total) * 100 + '%'
    };

    var extent = this.state.extent;
    extent = (extent) ?
      (extent.length > 1) ?
        extent[0] + ' – ' + extent[1] :
        extent[0]
      : '';

    return (
      /* jshint ignore:start */
      <div className='col10 pad2 dark'>
        <div className='space-bottom2 col12 clearfix'>
          <div className='col8'>
            <h4>{taskTitle}</h4>
            <h2>{extent}</h2>
          </div>
          <div className='col4'>
            <h4 className='block space-bottom0'>
              <strong>{d3.format(',')(completed)}</strong> complete
              <span className='quiet'> of {d3.format(',')(total)}</span>
            </h4>
            <div className='progress-bar clip contain fill-darken1 col12'>
              <div ref='progress' style={progressStyle} className='progress fill-darkgreen pin-left block col12'></div>
            </div>
          </div>
        </div>
        {this.state.stats ? <Graph
          data={this.state.stats} /> : ''}
      </div>
      /* jshint ignore:end */
    );
  }
});
