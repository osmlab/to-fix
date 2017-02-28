import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { ROLES } from '../../constants/user_constants';
import TasksSelectors from '../../stores/tasks_selectors';
import UserSelectors from '../../stores/user_selectors';
import TasksActionCreators from '../../stores/tasks_action_creators';

import ShowTask from './show_task';
import EditTask from './edit_task';
import AddTask from './add_task';

const mapStateToProps = (state) => ({
  currentTaskId: TasksSelectors.getCurrentTaskId(state),
  currentTask: TasksSelectors.getCurrentTask(state),
  isAuthenticated: UserSelectors.getIsAuthenticated(state),
  role: UserSelectors.getRole(state),
});

const mapDispatchToProps = {
  createTask: TasksActionCreators.createTask,
  updateTask: TasksActionCreators.updateTask,
};

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
    const { currentTask, updateTask, createTask, role, isAuthenticated } = this.props;

    if (!isAuthenticated) {
      return (
        <div className='col12 pad2 clearfix scroll-styled'>
          <h2 className='dark'>Please login to access the admin section.</h2>
        </div>
      );
    }

    if (role == ROLES.EDITOR) {
      return (
        <div className='col12 pad2 clearfix scroll-styled'>
          <h2 className='dark'>You need admin privileges to see this section.</h2>
        </div>
      );
    }

    return (
      <div className='col12 clearfix scroll-styled'>
        <div className='col6 pad2 dark'>
          {(taskWindow === 'show') ? <ShowTask task={currentTask} /> : null}
          {(taskWindow === 'edit') ? <EditTask task={currentTask} onTaskEdit={updateTask} /> : null}
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

Admin.propTypes = {
  currentTaskId: PropTypes.string.isRequired,
  currentTask: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  role: PropTypes.string,
  createTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
};

Admin = connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);

export default Admin;
