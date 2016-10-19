import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import Reflux from 'reflux';
import store from 'store';

import TasksStore from './stores/tasks_store';

import Task from './components/task';
import Stats from './components/stats';
import Admin from './components/admin';
import Activity from './components/activity';

import Header from './components/shared/header';
import Sidebar from './components/shared/sidebar';
import Modal from './components/shared/modal';
import ErrorDialog from './components/shared/error';

var App = React.createClass({
  mixins: [
    Reflux.listenTo(TasksStore, 'onTaskLoad')
  ],
  getInitialState: function() {
    return {
      tasks: TasksStore.loadTasks(),
      loading: true
    };
  },
  onTaskLoad: function(tasks) {
    store.set('tasks', tasks);
    this.setState({
      tasks: tasks,
      loading: false
    });
  },
  render: function () {
    var tasks = this.state.tasks;
    var loading = (this.state.loading) ? 'loading' : '';

    return (
      <div className={loading}>
        {tasks && <div>
          <Header />
          <Sidebar taskItems={this.state.tasks} />
          <div className='main clip fill-navy-dark col12 pin-bottom space-top6 animate col12 clearfix'>
            {this.props.children}
            <ErrorDialog />
          </div>
          <Modal />
        </div>}
      </div>
    );
  }
});

const defaultTask = '/task/tigerdelta';

export default (
  <Route path='/' component={App}>
    <IndexRedirect to={defaultTask} />
    <Route name='task' path='/task/:task' component={Task} />
    <Route name='activity' path='/activity/:task' component={Activity} />
    <Route name='stats' path='/stats/:task' component={Stats} />
    <Route name='admin' path='/admin/:task' component={Admin} />
  </Route>
);
