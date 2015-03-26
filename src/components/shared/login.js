'use strict';

var React = require('react');
var Reflux = require('reflux');

var config = require('../../config');
var userStore = require('../../stores/user_store');
var actions = require('../../actions/actions');

var Settings = require('./modals/settings');

module.exports = React.createClass({
  mixins: [
    Reflux.connect(userStore, 'user')
  ],

  render: function() {
    var logState;
    var user = this.state.user;
    var modal = document.getElementById('modal');
    var profile = config.userProfileURL + user.username;

    if (user.auth) {
      logState = (
        /* jshint ignore:start */
        <div className='pad1x col12 truncate clearfix'>
          <div className='pad0y inline'>
            <a className='strong small dark' target='_blank' href={profile} title='Profile on OpenStreetMap'>
              <img className='dot avatar' src={user.avatar} />
              {user.username}
            </a>
          </div>
          <button onClick={actions.openSettings} className='icon sprocket button quiet small animate fr'>Settings</button>
        </div>
        /* jshint ignore:end */
      );
    } else {
      logState = (
        /* jshint ignore:start */
        <div className='pad1x'>
          <button onClick={actions.userLogin} className='icon osm button small col12 animate'>Authorize on OSM</button>
        </div>
        /* jshint ignore:end */
      );
    }

    return (
    /* jshint ignore:start */
    <div className='space-bottom1'>
      <h4 className='dark block pad1x space-bottom1'>Account</h4>
      <div id='user-stuff' className='space-bottom1 col12 clearfix mobile-cols'>
        {logState}
      </div>
    </div>
    /* jshint ignore:end */
    );
  }
});
