'use strict';

var React = require('react');
var Router = require('react-router');
var NotFoundRoute = Router.NotFoundRoute;
var Navigation = Router.Navigation;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Redirect = Router.Redirect;

var Header = require('./components/shared/header');
var Sidebar = require('./components/shared/sidebar');
var Task = require('./components/task');
var Stats = require('./components/stats');
var Activity = require('./components/activity');
var Modal = require('./components/shared/modal');
var ErrorDialog = require('./components/shared/error');
var Admin = require('./components/admin');
var  taskserver = require('./mixins/taskserver');

//var tasks = require('./data/tasks.json').tasks;

// As there isn't a proper initial path for
// to-fix, redirect '/' to the first task in the sidebar
var firstTask = '';

function getTasks() {
  return {
    tasks: taskserver.get('tasks', function(err, res) {
      firstTask = '/task/' + res.tasks[0].id;
      return res.tasks;
    })
  }
}

var App = React.createClass({
  getInitialState: function() {
      return getTasks();
  },
  render: function () {
    console.log(this.state)
    return (
      /* jshint ignore:start */
      <div>
        <Header />
        <Sidebar taskItems={this.state.tasks} />
        <div className='main clip fill-navy-dark col12 pin-bottom space-top6 animate col12 clearfix'>
          <RouteHandler />
          <ErrorDialog />
        </div>
        <Modal />
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
    <Route name='stats' path='/stats/:task' handler={Stats} />
    <Route name='admin' path='/admin/:task' handler={Admin} />
    <DefaultRoute handler={Task} />
    <Redirect from='/' to={firstTask} />
  </Route>
  /* jshint ignore:end */
);


 
