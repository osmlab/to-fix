'use strict';

var React = require('react');
var Reflux = require('reflux');

var userStore = require('../../stores/user');
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
    var profile = 'http://www.openstreetmap.org/user/' + user.username;

    if (user.auth) {
      logState = (
        /* jshint ignore:start */
        <div className='col12 clearfix mobile-cols'>
          <a className='block truncate strong small col6 pad1x pad0y dark' target='_blank' href={profile} title='Profile on OpenStreetMap'>
            <img className='dot avatar' src={user.avatar} />
            {user.username}
          </a>
          <div className='col6 pad1x text-right'>
            <button onClick={actions.openSettings} className='icon sprocket button quiet small animate'>Settings</button>
          </div>
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
      <span className='dark block pad1x space-bottom1'>Account</span>
      <div id='user-stuff' className='space-bottom1 col12 clearfix mobile-cols'>
        {logState}
      </div>
    </div>
    /* jshint ignore:end */
    );
  }
});
