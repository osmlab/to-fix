import React from 'react';
import Reflux from 'reflux';
import { Link, withRouter } from 'react-router';

import appStore from '../../stores/application_store';
import LogIn from './login';
import actions from '../../actions/actions';

const Sidebar = React.createClass({
  mixins: [
    Reflux.connect(appStore, 'appSettings')
  ],

  render: function() {
    var topLevel = this.props.routes[1].name; // CHECK
    var appSettings = this.state.appSettings;
    var sidebarClass = 'sidebar pin-bottomleft clip col2 animate offcanvas-left fill-navy space-top6';
    if (appSettings.sidebar) sidebarClass += ' active';

    var tasks = this.props.taskItems.map(function(task, i) {
      if(!task.status){
        return (
          <Link
            to={`${topLevel}/${task.id}`}
            key={i}
            className='block strong dark pad1x pad0y truncate'>
            {task.title}
          </Link>
        );
      }
    });

    var completed_tasks = this.props.taskItems.map(function(task, i) {
      if(task.status){
        return (
          <Link
            to={`${topLevel}/${task.id}`}
            key={i}
            className='block strong dark pad1x pad0y truncate'>
            {task.title}
          </Link>
        );
      }
    });

    return (
      <div className={sidebarClass}>
        <div className='scroll-styled pad2y'>
          <LogIn />
          <h4 className='dark block pad1x space-bottom1'>Tasks</h4>
          <nav ref='taskList' className='space-bottom2'>{tasks}</nav>
          <h4 className='dark block pad1x space-bottom1'>Completed Tasks</h4>
          <nav ref='taskList' className='space-bottom2'>{completed_tasks}</nav>
        </div>
      </div>
    );
  }
});

export default withRouter(Sidebar);
