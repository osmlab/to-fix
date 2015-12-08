'use strict';

var React = require('react');
var Reflux = require('reflux');
var d3 = require('d3');

var actions = require('../../actions/actions');
var taskObj = require('../../mixins/taskobj');
var StatsStore = require('../../stores/stats_store');
var update = require('react/addons').addons.update;

module.exports = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Reflux.connect(StatsStore, 'stats'),
    Reflux.listenTo(actions.graphUpdated, 'graphUpdated'),
    Reflux.listenTo(actions.updatePermalink, 'updatePermalink')
  ],

  getInitialState: function() {
    return {
      extent: null,
      permalink: null,
      query: {}
    };
  },

  graphUpdated: function(dates, query) {
    // Revise the date title
    if (dates[0] === dates[1]) {
      this.setState({ extent: [dates[1]] });
    } else {
      this.setState({ extent: [dates[0], dates[1]] });
    }

    this.updatePermalink({
      from: query[0],
      to: query[1]
    });
  },

  updatePermalink: function(obj) {
    // Add query params to the URL
    var router = this.context.router;
    var params = router.getCurrentParams();
    var query = update(this.state.query, {$merge: obj});
    this.setState({
      query: query,
      permalink: router.makeHref('stats', {task: params.task}, query)
    });
  },

  render: function() {
    var taskTitle = taskObj(this.context.router.getCurrentParams().task).title;
    var totalSummary = '';
    if (this.state.stats.totals) {
      var available = this.state.stats.totals.available;
      var total = this.state.stats.totals.total;
      var completed = total - available;
      var progressStyle = {
        width: (completed / total) * 100 + '%'
      };

      totalSummary = (
        /* jshint ignore:start */
        <div className='col4'>
          <h4 className='block space-bottom0'>
            <strong>{d3.format(',')(completed)}</strong> complete
            <span className='quiet'> of {d3.format(',')(total)}</span>
          </h4>
          <div className='progress-bar clip contain fill-darken1 col12'>
            <div ref='progress' style={progressStyle} className='progress fill-darkgreen pin-left block col12'></div>
          </div>
        </div>
        /* jshint ignore:end */
      );
    }

    var permalink = '';
    var extent = this.state.extent;
    extent = (extent) ?
      (extent.length > 1) ?
        extent[0] + ' – ' + extent[1] :
        extent[0]
      : '';

    if (this.state.permalink) {
      permalink = (
      /* jshint ignore:start */
        <span className='fill-darken1 dot pad0 fl'>
          <a href={this.state.permalink} className='icon link' title='Link to these dates'></a>
        </span>
      /* jshint ignore:end */
      );
    }

    return (
      /* jshint ignore:start */
      <div className='space-bottom1 col12 clearfix'>
        <div className='col8'>
          <h4>{taskTitle}</h4>
          <h2 className='space col12 clearfix'>
            {permalink}
            {extent}
          </h2>
        </div>
        {totalSummary}
      </div>
      /* jshint ignore:end */
    );
  }
});
