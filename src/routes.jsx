'use strict';

var React = require('react');

var Router = require('react-router');
var NotFoundRoute = Router.NotFoundRoute;
var Navigation = Router.Navigation;
var State = Router.State;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;

var Header = require('./components/shared/header.jsx');
var Sidebar = require('./components/shared/sidebar.jsx');

var Task = require('./components/task.jsx');
var Activity = require('./components/activity.jsx');
var Stats = require('./components/stats.jsx');
var Upload = require('./components/upload.jsx');
var Landing = require('./components/landing.jsx');

var App = React.createClass({
  mixins: [State],
  render: function () {
    return (
      /* jshint ignore:start */
      <div>
        <Header />
        <Sidebar />

        <div id='main' className='main fill-navy-dark col12 pin-bottom space-top6 animate'>
          <RouteHandler />
        </div>

        <div id='errors' className='pin-top col12 z10000 center note warning'></div>
        <div id='message' className='pin-top col12 z10000 animate modal modal-content'></div>
        <div id='settings' className='pin-top col12 z10000 animate modal modal-content'></div>
      </div>
      /* jshint ignore:end */
    );
  }
});

module.exports = (
  /* jshint ignore:start */
  <Route handler={App}>
    <Route name='task' path='/task/:task' handler={Task} />
    <Route name='activity' path='/activity/:task' handler={Activity} />
    <Route name='stats' path='/statistics/:task' handler={Stats} />
    <Route name='upload' path='/upload' handler={Upload} />
    <DefaultRoute name='landing' handler={Landing} />
  </Route>
  /* jshint ignore:end */
);
