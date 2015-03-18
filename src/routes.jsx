'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var NotFoundRoute = Router.NotFoundRoute;
var Navigation = Router.Navigation;
var State = Router.State;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Redirect = Router.Redirect;

var Header = require('./components/shared/header.jsx');
var Sidebar = require('./components/shared/sidebar.jsx');

var Task = require('./components/task.jsx');
var Activity = require('./components/activity.jsx');
var Stats = require('./components/stats.jsx');
var Upload = require('./components/upload.jsx');
var Settings = require('./components/shared/modals/settings.jsx');
var actions = require('./actions/actions');

var tasks = require('./data/tasks.json').tasks;

// As there isn't a proper initial path for
// to-fix, redirect '/' to the first task in the sidebar
var firstTask = '/task/' + tasks[0].id;

var App = React.createClass({
  mixins: [
    State,
    Reflux.listenTo(actions.openSettings, 'openSettings'),
  ],

  getInitialState: function() {
    return {
      settingsModal: null
    };
  },

  openSettings: function() {
    this.setState({ settingsModal: true });
  },

  closeModal: function() {
    this.setState({ settingsModal: false });
  },

  render: function () {
    var settingsModal = (this.state.settingsModal) ?
      (<Settings onClose={this.closeModal}/>) : ''

    return (
      /* jshint ignore:start */
      <div>
        <Header />
        <Sidebar />
        <div className='main fill-navy-dark col12 pin-bottom space-top6 animate'>
          <RouteHandler />
        </div>
        {settingsModal}
      </div>
      /* jshint ignore:end */
    );
  }
});

module.exports = (
  /* jshint ignore:start */
  <Route path='/' handler={App}>
    <Route name='task' path='/task/:task' handler={Task} />
    <Route name='activity' path='/activity/:task' handler={Activity} />
    <Route name='stats' path='/statistics/:task' handler={Stats} />
    <Route name='upload' path='/upload' handler={Upload} />
    <DefaultRoute handler={Task} />
    <Redirect from='/' to={firstTask} />
  </Route>
  /* jshint ignore:end */
);
