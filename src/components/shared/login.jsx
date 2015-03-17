'use strict';

var React = require('react');
var Reflux = require('reflux');

var userStore = require('../../stores/user');
var actions = require('../../actions/actions');

module.exports = React.createClass({
  mixins: [
    Reflux.connect(userStore, 'user')
  ],

  render: function() {
    var logState;
    var user = this.state.user;

    if (user.auth) {
      logState = (
        /* jshint ignore:start */
        <div>
          <a className='block truncate strong small col6 pad1x pad0y dark' target='_blank' href='http://www.openstreetmap.org/user/username' title='Profile on OpenStreetMap'>
            <img className='dot avatar' src={user.avatar} />
            {user.username}
          </a>
          <div className='col6 pad1x text-right'>
            <a href='#' onClick={actions.userLogout} className='js-logout rcon logout button small animate'>Logout</a>
          </div>
        </div>
        /* jshint ignore:end */
      );
    } else {
      logState = (
        /* jshint ignore:start */
        <div className='pad1x'>
          <a href='#' onClick={actions.userLogin} className='js-login icon osm button small block animate'>Authorize on OpenStreetMap</a>
        </div>
        /* jshint ignore:end */
      );
    }

    return (
    /* jshint ignore:start */
    <div>
      <span className='dark block pad1x space-bottom1'>Account</span>
      <div id='user-stuff' className='space-bottom2 col12 clearfix mobile-cols'>
        {logState}
      </div>
    </div>
    /* jshint ignore:end */
    );
  }
});
