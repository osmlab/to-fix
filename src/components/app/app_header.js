import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import SettingsActionCreators from '../../stores/settings_action_creators';
import SettingsSelectors from '../../stores/settings_selectors';
import TasksSelectors from '../../stores/tasks_selectors';

const mapStateToProps = (state) => ({
  currentTaskId: TasksSelectors.getCurrentTaskId(state),
  sidebar: SettingsSelectors.getSidebarSetting(state),
});

const mapDispatchToProps = {
  toggleSidebar: SettingsActionCreators.toggleSidebar,
};

class Header extends Component {
  toggleSidebar = (e) => {
    e.preventDefault();
    this.props.toggleSidebar();
  }

  render() {
    const { currentTaskId, sidebar } = this.props;

    const isActive = sidebar ? 'active' : '';
    const toggleClass = `sidebar-toggle quiet block fl keyline-right animate pad1 row-60 ${isActive}`;

    return (
      <header className='fill-light keyline-bottom row-60 col12 clearfix mobile-cols'>
        <nav className='col6 truncate'>
          <a href='#' onClick={this.toggleSidebar} className={toggleClass}>
            <span className='icon big menu'></span>
          </a>
          <a href='/to-fix/' className='pad2x'>
            <h1 className='inline fancy title'>to-fix</h1>
          </a>
        </nav>
        <div className='col6 truncate text-right pad1'>
          <nav className='col12 space pad0y'>
            <Link
              className='icon pencil short button'
              activeClassName='active'
              to={`task/${currentTaskId}`}>
              Task
            </Link>
            <Link
              className='icon bolt short button'
              activeClassName='active'
              to={`activity/${currentTaskId}`}>
              Activity
            </Link>
            <Link
              className='icon graph short button'
              activeClassName='active'
              to={`stats/${currentTaskId}`}>
              Statistics
            </Link>
            <Link
              className='icon plus short button'
              activeClassName='active'
              to={`admin/${currentTaskId}`}>
              Admin
            </Link>
          </nav>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  currentTaskId: PropTypes.string.isRequired,
  sidebar: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

export default Header;
