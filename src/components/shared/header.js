'use strict';

import React from 'react';
import Reflux from 'reflux';
import { Link, withRouter } from 'react-router';

import appStore from '../../stores/application_store';
import actions from '../../actions/actions';

const Header = React.createClass({
  mixins: [
    Reflux.connect(appStore, 'appSettings')
  ],

  toggle: function(e) {
    e.preventDefault();
    actions.sidebarToggled();
  },

  render: function() {
    var appSettings = this.state.appSettings;
    var toggleClass = 'sidebar-toggle quiet block fl keyline-right animate pad1 row-60';
    if (appSettings.sidebar) toggleClass += ' active';
    var currentTask = this.props.params.task || '';

    return (
      <header className='fill-light keyline-bottom row-60 col12 clearfix mobile-cols'>
        <nav className='col6 truncate'>
          <a href='#' onClick={this.toggle} className={toggleClass}>
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
              to={`task/${currentTask}`}>
              Task
            </Link>
            <Link
              className='icon bolt short button'
              activeClassName='active'
              to={`activity/${currentTask}`}>
              Activity
            </Link>
            <Link
              className='icon graph short button'
              activeClassName='active'
              to={`stats/${currentTask}`}>
              Statistics
            </Link>
            <Link
              className='icon plus short button'
              activeClassName='active'
              to={`admin/${currentTask}`}>
              Admin
            </Link>
          </nav>
        </div>
      </header>
    );
  }
});

export default withRouter(Header);
