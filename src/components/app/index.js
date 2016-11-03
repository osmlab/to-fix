import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { getTasks, getTasksIsFetching } from '../../reducers';

import Header from './Header';
import Sidebar from './Sidebar';
// import Modal from './shared/modal';
// import ErrorDialog from './shared/error';

class App extends Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { fetchAllTasks } = this.props;
    fetchAllTasks();
  }

  render() {
    const { tasks, isFetching } = this.props;
    const loading = isFetching ? 'loading' : '';

    return (
      <div className={loading}>
        {tasks && <div>
          <Header />
          <Sidebar />
          <div className='main clip fill-navy-dark col12 pin-bottom space-top6 animate col12 clearfix'>
            {this.props.children}
          </div>
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

const mapStateToProps = (state) => {
  return {
    tasks: getTasks(state),
    isFetching: getTasksIsFetching(state),
  };
};

App = connect(
  mapStateToProps,
  actions,
)(App);

export default App;
