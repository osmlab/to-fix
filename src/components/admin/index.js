import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { ROLES } from '../../constants/user_constants';
import TasksSelectors from '../../stores/tasks_selectors';
import UserSelectors from '../../stores/user_selectors';
import TasksActionCreators from '../../stores/tasks_action_creators';

import ShowTask from './show_task';
import EditTask from './edit_task';

const mapStateToProps = (state) => ({
  currentTaskId: TasksSelectors.getCurrentTaskId(state),
  currentTask: TasksSelectors.getCurrentTask(state),
  currentTaskExtent: TasksSelectors.getCurrentTaskExtent(state),
  isAuthenticated: UserSelectors.getIsAuthenticated(state),
  role: UserSelectors.getRole(state),
});

const mapDispatchToProps = {
  updateTask: TasksActionCreators.updateTask,
};

class Admin extends Component {
  state = {
    taskWindow: 'show', // 'show' | 'edit'
  }

  setTaskWindow = (to) => {
    this.setState({
      taskWindow: to,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentTaskId !== this.props.currentTaskId) {
      this.setTaskWindow('show');
    }
  }

  render() {
    const { taskWindow } = this.state;
    const { currentTask, updateTask, currentTaskExtent, role, isAuthenticated } = this.props;

    const taskName = currentTask.value.name;
    const fromDate = currentTaskExtent.fromDate;

    if (!isAuthenticated) {
      return (
        <div className='col12 pad2 clearfix scroll-styled'>
          <h2 className='dark'>Please login to access the admin section.</h2>
        </div>
      );
    }

    if (role === ROLES.EDITOR) {
      return (
        <div className='col12 pad2 clearfix scroll-styled'>
          <h2 className='dark'>You need admin privileges to see this section.</h2>
        </div>
      );
    }

    return (
      <div className='col12 clearfix scroll-styled'>
        <div className='col12 pad2 dark'>
          <h2>{taskName}</h2>
          <h4 className='col12 clearfix'>
            {`Task last updated on ${fromDate}.`}
          </h4>
        </div>
        <div className='col8 dark'>
          {(taskWindow === 'show') ? <ShowTask task={currentTask} onEdit={() => this.setTaskWindow('edit')}/> : null}
          {(taskWindow === 'edit') ? <EditTask task={currentTask} onCancel={() => this.setTaskWindow('show')} onSubmit={updateTask} /> : null}
        </div>
      </div>
    );
  }
}

Admin.propTypes = {
  currentTaskId: PropTypes.string.isRequired,
  currentTask: PropTypes.object.isRequired,
  currentTaskExtent: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  role: PropTypes.string,
  updateTask: PropTypes.func.isRequired,
};

Admin = connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);

export default Admin;
