import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import TasksActionCreators from '../../stores/tasks_action_creators';
import TasksSelectors from '../../stores/tasks_selectors';

import AppHeader from './app_header';
import AppSidebar from './app_sidebar';
import SettingsModal from '../shared/settings_modal';
import ErrorModal from '../shared/error_modal';

const mapStateToProps = (state) => ({
  currentTaskId: TasksSelectors.getCurrentTaskId(state),
  currentTask: TasksSelectors.getCurrentTask(state),
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
    fetchAllTasks()
  }

  render() {
    const { currentTask } = this.props;

    return (
      <div>
        {currentTask
          ? <div>
              <AppHeader />
              <AppSidebar />
              <div className='main clip fill-navy-dark col12 pin-bottom space-top6 animate col12 clearfix'>
                {this.props.children}
                <ErrorModal />
              </div>
              <SettingsModal />
            </div>
          : <div className='loading' />
        }
      </div>
    );
  }
}

App.propTypes = {
  currentTaskId: PropTypes.string.isRequired,
  currentTask: PropTypes.object,
  fetchAllTasks: PropTypes.func.isRequired,
};

App = connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export default App;
