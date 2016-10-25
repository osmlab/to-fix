import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import { connect } from 'react-redux';

import { getSidebarSetting, getCurrentTasks, getCompletedTasks } from '../../reducers';

import Login from './login';

class Sidebar extends Component {
  renderTaskList(tasks) {
    const { topLevelRoute } = this.props;

    return tasks.map((task, i) => (
      <Link
        to={`${topLevelRoute}/${task.idtask}`}
        key={i}
        className='block strong dark pad1x pad0y truncate'>
        {task.value.description}
      </Link>
    ));
  }

  render() {
    const { sidebar, currentTasks, completedTasks } = this.props;

    let sidebarClass = 'sidebar pin-bottomleft clip col2 animate offcanvas-left fill-navy space-top6';
    if (sidebar) sidebarClass += ' active';

    return (
      <div className={sidebarClass}>
        <div className='scroll-styled pad2y'>
          <Login />
          <h4 className='dark block pad1x space-bottom1'>Current Tasks</h4>
          <nav ref='taskList' className='space-bottom2'>{this.renderTaskList(currentTasks)}</nav>
          <h4 className='dark block pad1x space-bottom1'>Completed Tasks</h4>
          <nav ref='taskList' className='space-bottom2'>{this.renderTaskList(completedTasks)}</nav>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { routes }) => ({
  topLevelRoute: routes[1].name,
  sidebar: getSidebarSetting(state),
  currentTasks: getCurrentTasks(state),
  completedTasks: getCompletedTasks(state),
});

Sidebar = withRouter(connect(
  mapStateToProps
)(Sidebar));

export default Sidebar;
