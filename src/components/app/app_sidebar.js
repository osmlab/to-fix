import React, { Component, PropTypes } from 'react';
import { Link, withRouter } from 'react-router';
import { connect } from 'react-redux';

import { ROLES } from '../../constants/user_constants';
import UserSelectors from '../../stores/user_selectors';
import TasksSelectors from '../../stores/tasks_selectors';
import SettingsSelectors from '../../stores/settings_selectors';
import ModalsActionCreators from '../../stores/modals_action_creators';

const mapStateToProps = (state, { routes }) => ({
  topLevelRoute: routes[1].name,
  role: UserSelectors.getRole(state),
  userId: UserSelectors.getOsmId(state),
  sidebar: SettingsSelectors.getSidebarSetting(state),
  activeTasks: TasksSelectors.getActiveTasks(state),
  completedTasks: TasksSelectors.getCompletedTasks(state),
});

const mapDispatchToProps = {
  openCreateTaskModal: ModalsActionCreators.openCreateTaskModal,
};

class Sidebar extends Component {
  renderCreateTaskBtn() {
    const { role, topLevelRoute, openCreateTaskModal } = this.props;

    if (role === ROLES.ADMIN || role === ROLES.SUPERADMIN) {
      if (topLevelRoute === "admin") {
        return (
          <div className='pad1x space-bottom1'>
            <button className='button icon plus truncate col12 animate' onClick={openCreateTaskModal}>
              Create a new task
            </button>
          </div>
        );
      }
    }

    return null;
  }

  renderTaskList(tasks) {
    const { role, userId, topLevelRoute } = this.props;

    if (tasks.length === 0) {
      return <p className='quiet strong small block pad1x'>No tasks.</p>;
    };

    return tasks.map((task, i) => {
      let iconClass = '';
      if (topLevelRoute === "admin") {
        if (role === ROLES.SUPERADMIN || (role === ROLES.ADMIN && task.iduser === userId)) {
          iconClass = 'icon pencil';
        } else {
          iconClass = 'icon lock';
        }
      }

      return (
        <Link
          to={`${topLevelRoute}/${task.idtask}`}
          key={i}
          className={`block strong pad1x pad0y truncate ${iconClass}`}
          title={task.value.name}
          activeClassName='active'>
          {task.value.name}
        </Link>
      );
    });
  }

  render() {
    const { sidebar, activeTasks, completedTasks } = this.props;

    const isActive = sidebar ? 'active' : '';
    const sidebarClass = `sidebar pin-bottomleft clip col2 animate offcanvas-left fill-navy space-top6 ${isActive}`;

    const createTaskBtn = this.renderCreateTaskBtn();
    const activeTasksList = this.renderTaskList(activeTasks);
    const completedTasksList = this.renderTaskList(completedTasks);

    return (
      <div className={sidebarClass}>
        <div className='scroll-styled pad2y'>
          {createTaskBtn}
          <h4 className='dark block pad1x space-bottom1'>Current Tasks</h4>
          <nav className='dark space-bottom2'>{activeTasksList}</nav>
          <h4 className='dark block pad1x space-bottom1'>Completed Tasks</h4>
          <nav className='dark space-bottom2'>{completedTasksList}</nav>
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  topLevelRoute: PropTypes.string.isRequired,
  role: PropTypes.string,
  userId: PropTypes.string,
  sidebar: PropTypes.bool.isRequired,
  activeTasks: PropTypes.array.isRequired,
  completedTasks: PropTypes.array.isRequired,
  openCreateTaskModal: PropTypes.func.isRequired,
};

Sidebar = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar));

export default Sidebar;
