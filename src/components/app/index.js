import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { AsyncStatus } from '../../stores/async_action';
import TasksActionCreators from '../../stores/tasks_action_creators';
import TasksSelectors from '../../stores/tasks_selectors';
import LoadingSelectors from '../../stores/loading_selectors';

import AppHeader from './app_header';
import AppSidebar from './app_sidebar';
import SettingsModal from '../shared/settings_modal';
import SuccessModal from '../shared/success_modal';
import ErrorModal from '../shared/error_modal';
import CreateTaskModal from '../shared/create_task_modal';
import ManageUsersModal from '../shared/manage_users_modal';

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
  state = {
    appLoading: false,
    errorMessage: '',
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { fetchAllTasks } = this.props;
    this.setState({ appLoading: true });
    fetchAllTasks()
      .then(response => {
        this.setState({ appLoading: false });

        if (response.status === AsyncStatus.FAILURE) {
          this.setState({
            errorMessage: response.error.message || 'Something went wrong.',
          });
        }
      });
  }

  componentDidUpdate() {
    const { currentTaskId, latestTaskId, router } = this.props;
    if (!currentTaskId && latestTaskId) {
      router.push(`/task/${latestTaskId}`);
    }
  }

  render() {
    const { currentTask, isLoading } = this.props;
    const { appLoading, errorMessage } = this.state;

    const appLoadingClass = appLoading ? 'loading' : '';
    const componentLoadingClass = isLoading ? 'loading' : '';

    return (
      <div className={`${appLoadingClass}`}>
        {errorMessage && <div className='col12 pad2 clearfix scroll-styled'>
          <h2 className='dark'>{errorMessage}</h2>
        </div>}
        {currentTask && <div>
          <AppHeader />
          <AppSidebar />
          <div className={`main clip fill-navy-dark col12 pin-bottom space-top6 animate ${componentLoadingClass}`}>
            {this.props.children}
          </div>
          <SuccessModal />
          <ErrorModal />
          <SettingsModal />
          <CreateTaskModal />
          <ManageUsersModal />
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
