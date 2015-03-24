'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;
var appStore = require('../../stores/application_store');
var taskItems = require('../../data/tasks.json').tasks;
var LogIn = require('./login');
var actions = require('../../actions/actions');

module.exports = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Reflux.connect(appStore, 'appSettings')
  ],

  render: function() {
    var topLevel = this.context.router.getCurrentRoutes()[1].name;
    var appSettings = this.state.appSettings;
    var sidebarClass = 'sidebar pin-bottomleft clip col2 animate offcanvas-left fill-navy space-top6';
    if (appSettings.sidebar) sidebarClass += ' active';

    var tasks = taskItems.map(function(task, i) {
      return (
        /* jshint ignore:start */
        <Link
          to={topLevel}
          key={i}
          className='block strong dark pad1x pad0y truncate'
          params={{task: task.id}}>
          {task.title}
        </Link>
        /* jshint ignore:end */
      );
    });

    return (
      /* jshint ignore:start */
      <div className={sidebarClass}>
        <div className='scroll-styled pad2y'>
          <LogIn />
          <h4 className='dark block pad1x space-bottom1'>Tasks</h4>
          <nav ref='taskList' className='space-bottom2'>{tasks}</nav>
          <div className='pad1x'>
            <button onClick={actions.openUpload} className='button icon plus quiet small short'>New task</button>
          </div>
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});
