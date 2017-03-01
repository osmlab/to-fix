import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import TasksActionCreators from '../../stores/tasks_action_creators';
import TasksSelectors from '../../stores/tasks_selectors';
import LoadingSelectors from '../../stores/loading_selectors';

import AppHeader from './app_header';
import AppSidebar from './app_sidebar';
import SettingsModal from '../shared/settings_modal';
import SuccessModal from '../shared/success_modal';
import ErrorModal from '../shared/error_modal';
import CreateTaskModal from '../shared/create_task_modal';

const mapStateToProps = (state) => ({
  currentTaskId: TasksSelectors.getCurrentTaskId(state),
  latestTaskId: TasksSelectors.getLatestTaskId(state),
  currentTask: TasksSelectors.getCurrentTask(state),
  isLoading: LoadingSelectors.getIsLoading(state),
});

const mapDispatchToProps = {
  fetchAllTasks: TasksActionCreators.fetchAllTasks,
};

class App extends Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { fetchAllTasks } = this.props;
    fetchAllTasks();
  }

  componentDidUpdate() {
    const { currentTaskId, latestTaskId, router } = this.props;
    if (!currentTaskId && latestTaskId) {
      router.push(`/task/${latestTaskId}`);
    }
  }

  render() {
    const { currentTask, isLoading } = this.props;
    const loadingClass = isLoading ? 'loading' : '';

    return (
      <div className={loadingClass}>
        {currentTask && <div>
          <AppHeader />
          <AppSidebar />
          <div className='main clip fill-navy-dark col12 pin-bottom space-top6 animate col12 clearfix'>
            {this.props.children}
          </div>
          <SuccessModal />
          <ErrorModal />
          <SettingsModal />
          <CreateTaskModal />
        </div>}
      </div>
    );
  }
}

App.propTypes = {
  router: PropTypes.object.isRequired,
  currentTaskId: PropTypes.string,
  latestTaskId: PropTypes.string,
  currentTask: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  fetchAllTasks: PropTypes.func.isRequired,
};

App = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(App));

export default App;
