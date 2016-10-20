import React from 'react';
import Reflux from 'reflux';
import store from 'store';

import TasksStore from '../stores/tasks_store';

import Header from './shared/header';
import Sidebar from './shared/sidebar';
import Modal from './shared/modal';
import ErrorDialog from './shared/error';

const App = React.createClass({
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

export default App;
