import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { fetchAllTasks, setTaskId } from '../../actions';
import {
  getCurrentTask,
  getTasksIsFetching,
  getTasksError,
} from '../../reducers';

import AppHeader from './app_header';
import AppSidebar from './app_sidebar';
import SettingsModal from '../shared/settings_modal';
import ErrorModal from '../shared/error_modal';

class App extends Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { fetchAllTasks, setTaskId, currentTaskId } = this.props;
    fetchAllTasks()
      .then(() => setTaskId({ idtask: currentTaskId }));
  }

  render() {
    const { currentTask, isFetching } = this.props;
    const loading = isFetching ? 'loading' : '';

    return (
      <div className={loading}>
        {currentTask && <div>
          <AppHeader />
          <AppSidebar />
          <div className='main clip fill-navy-dark col12 pin-bottom space-top6 animate col12 clearfix'>
            {this.props.children}
            <ErrorModal />
          </div>
          <SettingsModal />
        </div>}
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => {
  return {
    currentTaskId: params.task,
    currentTask: getCurrentTask(state),
    isFetching: getTasksIsFetching(state),
    error: getTasksError(state),
  };
};

App = withRouter(connect(
  mapStateToProps,
  { fetchAllTasks, setTaskId },
)(App));

export default App;
