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
var Reflux = require('reflux');
var store = require('store');

var TasksStore = require('./stores/tasks_store');
var Header = require('./components/shared/header');
var Sidebar = require('./components/shared/sidebar');
var Task = require('./components/task');
var Stats = require('./components/stats');
var Activity = require('./components/activity');
var Modal = require('./components/shared/modal');
var ErrorDialog = require('./components/shared/error');
var Admin = require('./components/admin');
var taskobj = require('./mixins/taskobj');

// As there isn't a proper initial path for

var firstTask = '/task/tigerdelta';// to-fix, redirect start tigerdelta

var App = React.createClass({
  mixins: [
    Reflux.listenTo(TasksStore, 'onTaksLoad')
  ],
  getInitialState: function() {
    return {
      tasks: TasksStore.loadTasks(),
      loading: true
    };
  },
  onTaksLoad(tasks){
    store.set('tasks',tasks);
    this.setState({
      tasks: tasks,
      loading: false
    });
  },
  render: function () {
    var tasks= this.state.tasks;
    var loading = (this.state.loading) ? 'loading' : '';

    return (
      <div className={loading}>
        {tasks && <div>
          <Header />
          <Sidebar taskItems={this.state.tasks} />
          <div className='main clip fill-navy-dark col12 pin-bottom space-top6 animate col12 clearfix'>
            <RouteHandler />
            <ErrorDialog />
          </div>
          <Modal />
        </div>}
      </div>
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