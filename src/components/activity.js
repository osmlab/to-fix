'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var d3 = require('d3');

var actions = require('../actions/actions');
var taskObj = require('../mixins/taskobj');
var ActivityStore = require('../stores/activity_store');

module.exports = React.createClass({
  mixins: [
    Reflux.connect(ActivityStore, 'activity'),
    Reflux.listenTo(actions.taskActivityLoaded, 'activityLoaded'),
    Router.State,
    taskObj
  ],

  getInitialState: function() {
    return {
      loadCount: 25
    };
  },

  statics: {
    fetchData: function(params) {
      actions.taskActivity(params.task);
    }
  },

  loadMore: function() {
    this.setState({ loadCount: this.state.loadCount += 25 });
  },

  activityLoaded: function() {
    // Reset the load count when new data has loaded.
    this.setState({ loadCount: 25 });
  },

  render: function() {
    var row;
    var dateDisplay = d3.time.format('%B %-d');
    var timeDisplay = d3.time.format('%-I:%-M%p');

    if (this.state.activity.length) {
      // Show only the first 25 results.
      row = this.state.activity.slice(0, this.state.loadCount).map(function(action, i) {
        if (!action.attributes.user) return;
        var permalink = 'key-' + action.attributes.key;
        var profile ='https://www.openstreetmap.org/user/' + action.attributes.user;
        var editor = (action.attributes.editor) ? action.attributes.editor : '';
        var actionDay = dateDisplay(new Date(action.unixtime * 1000));
        var actionTime = timeDisplay(new Date(action.unixtime * 1000));

        return (
          /* jshint ignore:start */
          <div id={permalink} key={i} className='col12 clearfix fill-darken1 dark mobile-cols'>
            <div className='fl strong pad1 fill-darken1 editor-key'>
              <span className='capitalize'>{action.attributes.action}</span>
            </div>
            <div className='pad1 fl space'>
              <a href={profile} target='_blank' className='icon account'>
                {action.attributes.user}
              </a>
              <strong className='fill-navy inline micro pad0x uppercase'>{editor}</strong>
            </div>
            <div className='pad1 space fr'>
              <span className='quiet'>{actionDay}</span>
              {actionTime}
            </div>
          </div>
          /* jshint ignore:end */
        );
      });
    } else {
      /* jshint ignore:start */
      row = (<strong className='quiet'>No recent activity found.</strong>);
      /* jshint ignore:end */
    }

    var taskTitle = taskObj(this.getParams().task).title;

    // Load more button
    var loadmore = '';

    if (this.state.activity.length) {
      /* jshint ignore:start */
      if (this.state.loadCount >= this.state.activity.length) {
        loadmore = (<button className='col12 quiet disabled round-bottom'>Activity loaded</button>);
      } else {
        loadmore = (<button onClick={this.loadMore} className='col12 round-bottom'>Load more</button>);
      }
      /* jshint ignore:end */
    }

    return (
      /* jshint ignore:start */
      <div className='col12 clearfix scroll-styled'>
        <div className='col10 pad2 dark'>
          <div className='space-bottom1 col12 clearfix'>
            <h4>{taskTitle}</h4>
          </div>
          <div className='rows'>
            {row}
            {loadmore}
          </div>
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});
