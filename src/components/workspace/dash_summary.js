'use strict';

var React = require('react');
var Reflux = require('reflux');
var d3 = require('d3');

var StatsStore = require('../../stores/stats_store');
var actions = require('../../actions/actions');
var config = require('../../config');

module.exports = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Reflux.connect(StatsStore, 'stats'),
    Reflux.listenTo(actions.graphUpdated, 'graphUpdated')
  ],

  graphUpdated: function(dates, query) {
    var task = this.context.router.getCurrentParams().task;
    actions.statSummaries(task, query);
  },

  render: function() {
    var numFormat = d3.format(',');
    var summaries = this.state.stats.summaries;
    var contributions = '';

    if (summaries && summaries.length) {
      contributions = this.state.stats.summaries.map(function(sum, i) {
          var profile = config.userProfileURL + sum.user;
          var edit = (sum.edit) ? numFormat(sum.edit) : '';
          var fix = (sum.fix) ? numFormat(sum.fix) : '';
          var skip = (sum.skip) ? numFormat(sum.skip) : '';
          var total = (sum.total) ? numFormat(sum.total) : '';

          return (
            /* jshint ignore:start */
            <div key={i} className='col12 clearfix'>
              <span className='col8'>
                <a href={profile} target='_blank' className='inline strong pad0y'>{sum.user}</a>
              </span>
              <span className='col1 pad0y text-right'>{edit}</span>
              <span className='col1 pad0y text-right'>{fix}</span>
              <span className='col1 pad0y text-right'>{skip}</span>
              <span className='col1 pad0y text-right'>{total}</span>
            </div>
            /* jshint ignore:end */
          );
      });
    } else {
      contributions = (
        /* jshint ignore:start */
        <strong className='quiet pad0y block'>No data</strong>
        /* jshint ignore:end */
      );
    }

    return (
      /* jshint ignore:start */
      <div className='contributions'>
        <div className='col12 clearfix'>
          <h4 className='col8'>Contributors</h4>
          <h4 className='col1 pad0y text-right'>Edited</h4>
          <h4 className='col1 pad0y text-right'>Fixed</h4>
          <h4 className='col1 pad0y text-right'>Skipped</h4>
          <h4 className='col1 pad0y text-right'>Total</h4>
        </div>
        {contributions}
      </div>
      /* jshint ignore:end */
    );
  }
});
