'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var actions = require('../actions/actions');
var taskObj = require('../mixins/taskobj');
var d3Graph = require('../util/d3Graph');
var ActivityStore = require('../stores/activity_store');

module.exports = React.createClass({
  mixins: [
    Reflux.connect(ActivityStore, 'activity'),
    Reflux.listenTo(actions.sidebarToggled, 'resize'),
    Reflux.listenTo(actions.graphInitialized, 'graphInitialized'),
    Reflux.listenTo(actions.graphUpdated, 'graphUpdated'),
    Router.State,
    taskObj
  ],

  getInitialState: function() {
    return {
      extent: null,
      totals: {
        'total': 5096,
        'available': 3646
      }
    };
  },

  statics: {
    fetchData: function(params) {
      actions.taskStats(params.task);
    }
  },

  getGraphState: function() {
    return {
      data: this.state.activity
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

  componentDidMount: function() {
    var el = this.refs.brushgraph.getDOMNode();
    d3Graph.create(el, this.getGraphState());
  },

  componentDidUpdate: function() {
    d3Graph.update(this.refs.brushgraph.getDOMNode(), this.getGraphState());
  },

  componentWillUnmount: function() {
    d3Graph.destroy(this.refs.brushgraph.getDOMNode());
  },

  resize: function() {
    var _this = this;
    window.setTimeout(function() {
      d3Graph.resize(_this.refs.brushgraph.getDOMNode());
    }, 300);
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
        <div className='fill-darken1 pad2 round col12'>
          <div ref='brushgraph'></div>
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});
