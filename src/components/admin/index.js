import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import TasksSelectors from '../../stores/tasks_selectors';
import TasksActionCreators from '../../stores/tasks_action_creators';

import ShowTask from './show_task';
import EditTask from './edit_task';
import AddTask from './add_task';

const mapStateToProps = (state) => ({
  currentTaskId: TasksSelectors.getCurrentTaskId(state),
  currentTask: TasksSelectors.getCurrentTask(state),
  currentTaskExtent: TasksSelectors.getCurrentTaskExtent(state),
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

  componentDidUpdate(prevProps) {
    if (prevProps.currentTaskId !== this.props.currentTaskId) {
      this.setState({
        taskWindow: 'show',
      });
    }
  }

  render() {
    const { taskWindow } = this.state;
    const { currentTask, updateTask, createTask, currentTaskExtent } = this.props;

    const taskName = currentTask.value.name;
    const fromDate = currentTaskExtent.fromDate;

    return (
      <div className='col12 clearfix scroll-styled'>
        <div className='col12 pad2 dark'>
          <h2>{taskName}</h2>
          <h4 className='col12 clearfix'>
            {`Task last updated on ${fromDate}.`}
          </h4>
        </div>
        <div className='col2 pad2 dark'>
          <div className='pill'>
            <a onClick={() => this.setTaskWindow('add') } className='col12 button icon plus pad2x space-bottom0 quiet truncate'>Create a new task</a>
            <a onClick={() => this.setTaskWindow('edit')} className='col12 button icon pencil pad2x space-bottom0 quiet truncate'>Edit current task</a>
          </div>
        </div>
        <div className='col8 pad2 dark'>
          {(taskWindow === 'show') ? <ShowTask task={currentTask} /> : null}
          {(taskWindow === 'edit') ? <EditTask task={currentTask} onTaskEdit={updateTask} /> : null}
          {(taskWindow === 'add') ? <AddTask onTaskAdd={createTask} /> : null}
        </div>
      </div>
    );
  }
}

Admin.propTypes = {
  currentTaskId: PropTypes.string.isRequired,
  currentTask: PropTypes.object.isRequired,
  currentTaskExtent: PropTypes.object.isRequired,
  createTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
};

Admin = connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);

export default Admin;
