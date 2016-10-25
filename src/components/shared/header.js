import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { getSidebarSetting } from '../../reducers';

class Header extends Component {
  toggleSidebar = (e) => {
    e.preventDefault();
    this.props.toggleSidebar();
  }

  render() {
    const { currentTaskId, sidebar } = this.props;

    let toggleClass = 'sidebar-toggle quiet block fl keyline-right animate pad1 row-60';
    if (sidebar) toggleClass += ' active';

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

const mapStateToProps = (state, { params }) => ({
  currentTaskId: params.task,
  sidebar: getSidebarSetting(state),
});

Header = withRouter(connect(
  mapStateToProps,
  actions
)(Header));

export default Header;
