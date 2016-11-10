import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import { connect } from 'react-redux';

import { setTaskId } from '../../actions';
import { getSidebarSetting, getActiveTasks, getCompletedTasks } from '../../reducers';

import Login from '../shared/Login';

class Sidebar extends Component {
  renderTaskList(tasks) {
    const { topLevelRoute, setTaskId } = this.props;

    if (tasks.length === 0) {
      return <p className='quiet strong small block pad1x'>No tasks.</p>;
    };

    return tasks.map((task, i) => (
      <Link
        to={`${topLevelRoute}/${task.idtask}`}
        key={i}
        className='block strong pad1x pad0y truncate'
        activeClassName='active'
        onClick={() => setTaskId({ idtask: task.idtask })}>
        {task.value.name}
      </Link>
    ));
  }

  render() {
    const { sidebar, activeTasks, completedTasks } = this.props;

    let sidebarClass = 'sidebar pin-bottomleft clip col2 animate offcanvas-left fill-navy space-top6';
    if (sidebar) sidebarClass += ' active';

    return (
      <div className={sidebarClass}>
        <div className='scroll-styled pad2y'>
          <Login />
          <h4 className='dark block pad1x space-bottom1'>Current Tasks</h4>
          <nav className='dark space-bottom2'>{this.renderTaskList(activeTasks)}</nav>
          <h4 className='dark block pad1x space-bottom1'>Completed Tasks</h4>
          <nav className='dark space-bottom2'>{this.renderTaskList(completedTasks)}</nav>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { routes }) => ({
  topLevelRoute: routes[1].name,
  sidebar: getSidebarSetting(state),
  activeTasks: getActiveTasks(state),
  completedTasks: getCompletedTasks(state),
});

Sidebar = withRouter(connect(
  mapStateToProps,
  { setTaskId }
)(Sidebar));

export default Sidebar;
