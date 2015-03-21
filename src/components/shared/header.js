'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;

var appStore = require('../../stores/application_store');
var actions = require('../../actions/actions');

module.exports = React.createClass({
  mixins: [
    Router.State,
    Reflux.connect(appStore, 'appSettings')
  ],

  toggle: function(e) {
    e.preventDefault();
    actions.sidebarToggled();
  },

  render: function() {
    var appSettings = this.state.appSettings;
    var toggleClass = 'sidebar-toggle quiet block fl keyline-right animate pad1 row-60';
    if (appSettings.sidebar) toggleClass += ' active';
    var currentTask = this.getParams().task;

    return (
      /* jshint ignore:start */
      <header className='fill-light keyline-bottom row-60 col12 clearfix'>
        <nav className='col3'>
          <a href='#' onClick={this.toggle} className={toggleClass}>
            <span className='icon big menu'></span>
          </a>
          <a href='/to-fix/' className='pad2x'>
            <h1 className='inline fancy title'>to-fix</h1>
          </a>
        </nav>
        <div className='col9 text-right pad1'>
          <nav className='js-mode-controls col12 text-right space pad0y'>
            <Link
              className='icon pencil animate short button'
              params={{ task: currentTask }}
              to='task'>
              Task
            </Link>
            <Link
              className='icon bolt animate short button'
              params={{ task: currentTask }}
              to='activity'>
              Activity
            </Link>
          </nav>
        </div>
      </header>
      /* jshint ignore:end */
    );
  }
});
