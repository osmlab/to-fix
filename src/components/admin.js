import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { updateTask, createTask } from '../actions';
import { getCurrentTask } from '../reducers';

import ShowTask from './admin/show_task';
import EditTask from './admin/edit_task';
import AddTask from './admin/add_task';

class Admin extends Component {
  state = {
    taskWindow: 'show', // 'show' | 'edit' | 'add'
  }

  setTaskWindow(to) {
    this.setState({
      taskWindow: to,
    });
  }

  render() {
    const { taskWindow } = this.state;
    const { currentTask, updateTask, createTask } = this.props;

    return (
      <div className='col12 clearfix scroll-styled'>
        <div className='col6 pad2 dark'>
          {(taskWindow === 'show' && currentTask) ? <ShowTask task={currentTask} /> : null}
          {(taskWindow === 'edit' && currentTask) ? <EditTask task={currentTask} onTaskEdit={updateTask} /> : null}
          {(taskWindow === 'add') ? <AddTask onTaskAdd={createTask} /> : null}
        </div>
          <div className='col6 pad2 dark'>
          <div className='pill'>
            <a onClick={() => this.setTaskWindow('show')} className='button pad2x quiet'>Show details</a>
            <a onClick={() => this.setTaskWindow('edit')} className='button pad2x quiet'>Edit task</a>
            <a onClick={() => this.setTaskWindow('add') } className='button pad2x quiet'>Add new task</a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => ({
  currentTaskId: params.task,
  currentTask: getCurrentTask(state),
});

Admin = withRouter(connect(
  mapStateToProps,
  { updateTask, createTask }
)(Admin));

export default Admin;
