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

var Header = require('./components/shared/header');
var Sidebar = require('./components/shared/sidebar');

var Task = require('./components/task');
var Activity = require('./components/activity');

var Upload = require('./components/shared/modals/upload');
var Settings = require('./components/shared/modals/settings');
var ErrorDialog = require('./components/shared/error');
var actions = require('./actions/actions');

var tasks = require('./data/tasks.json').tasks;

// As there isn't a proper initial path for
// to-fix, redirect '/' to the first task in the sidebar
var firstTask = '/task/' + tasks[0].id;

var App = React.createClass({
  mixins: [
    State,
    Reflux.listenTo(actions.openSettings, 'openSettings'),
    Reflux.listenTo(actions.openUpload, 'openUpload')
  ],

  getInitialState: function() {
    return {
      settingsModal: null,
      UploadModal: null
    };
  },

  openSettings: function() { this.setState({ settingsModal: true }); },
  openUpload: function() { this.setState({ uploadModal: true }); },

  closeModal: function() {
    this.setState({
      settingsModal: null,
      uploadModal: null
    });
  },

  render: function () {
    var settingsModal = (this.state.settingsModal) ?
      (<Settings onClose={this.closeModal}/>) : '';

    var uploadModal = (this.state.uploadModal) ?
      (<Upload onClose={this.closeModal}/>) : '';

    return (
      /* jshint ignore:start */
      <div>
        <Header />
        <Sidebar />
        <div className='main clip fill-navy-dark col12 pin-bottom space-top6 animate col12 clearfix'>
          <RouteHandler />
          <ErrorDialog />
        </div>
        {settingsModal}
        {uploadModal}
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
    <DefaultRoute handler={Task} />
    <Redirect from='/' to={firstTask} />
  </Route>
  /* jshint ignore:end */
);
