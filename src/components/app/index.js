import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { fetchAllTasks, fetchTaskById, selectTask } from '../../actions';
import {
  getCurrentTask,
  getTasksIsFetching,
} from '../../reducers';

import Header from './Header';
import Sidebar from './Sidebar';
import Settings from '../shared/Settings';
// import Modal from './shared/modal';
// import ErrorDialog from './shared/error';

class App extends Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { fetchAllTasks, fetchTaskById, selectTask, currentTaskId } = this.props;
    fetchAllTasks()
      .then(() => fetchTaskById({ idtask: currentTaskId }))
      .then(() => selectTask({ idtask: currentTaskId }));
  }

  render() {
    const { currentTask, isFetching } = this.props;
    const loading = isFetching ? 'loading' : '';

    return (
      <div className={loading}>
        {currentTask && <div>
          <Header />
          <Sidebar />
          <div className='main clip fill-navy-dark col12 pin-bottom space-top6 animate col12 clearfix'>
            {this.props.children}
          </div>
          <Settings />
        </div>}
      </div>
    );
  }
}

// <div className={loading}>
//   {tasks && <div>
//     <Header />
//     <Sidebar taskItems={tasks} />
//     <div className='main clip fill-navy-dark col12 pin-bottom space-top6 animate col12 clearfix'>
//       {this.props.children}
//       <ErrorDialog />
//     </div>
//     <Modal />
//   </div>}
// </div>

const mapStateToProps = (state, { params }) => {
  return {
    currentTaskId: params.task,
    currentTask: getCurrentTask(state),
    isFetching: getTasksIsFetching(state),
  };
};

App = withRouter(connect(
  mapStateToProps,
  { fetchAllTasks, fetchTaskById, selectTask },
)(App));

export default App;
