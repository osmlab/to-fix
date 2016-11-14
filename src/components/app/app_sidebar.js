import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import { connect } from 'react-redux';

import TasksSelectors from '../../stores/tasks_selectors';
import SettingsSelectors from '../../stores/settings_selectors';

import Login from '../shared/login';

const mapStateToProps = (state, { routes }) => ({
  topLevelRoute: routes[1].name,
  sidebar: SettingsSelectors.getSidebarSetting(state),
  activeTasks: TasksSelectors.getActiveTasks(state),
  completedTasks: TasksSelectors.getCompletedTasks(state),
});

class Sidebar extends Component {
  renderTaskList(tasks) {
    const { topLevelRoute } = this.props;

    if (tasks.length === 0) {
      return <p className='quiet strong small block pad1x'>No tasks.</p>;
    };

    return tasks.map((task, i) => (
      <Link
        to={`${topLevelRoute}/${task.idtask}`}
        key={i}
        className='block strong pad1x pad0y truncate'
        activeClassName='active'>
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

Sidebar = withRouter(connect(
  mapStateToProps
)(Sidebar));

export default Sidebar;
