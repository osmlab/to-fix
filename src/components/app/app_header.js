import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import SettingsActionCreators from '../../stores/settings_action_creators';
import SettingsSelectors from '../../stores/settings_selectors';
import TasksSelectors from '../../stores/tasks_selectors';

import Login from '../shared/login';

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
        <nav className='col4 truncate'>
          <a href='#' onClick={this.toggleSidebar} className={toggleClass}>
            <span className='icon big menu'></span>
          </a>
          <a href='/to-fix/' className='pad2x'>
            <h1 className='inline fancy title'>to-fix</h1>
          </a>
        </nav>
        <div className='col8 truncate text-right pad1'>
          <nav className='inline space pad0y keyline-right'>
            <Link
              className='icon pencil short button'
              activeClassName='active'
              to={`task/${currentTaskId}`}>
              Review
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
          </nav>
          <div className='fr inline truncate'>
            <Login />
          </div>
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
