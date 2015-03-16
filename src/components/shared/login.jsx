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
    return (
    /* jshint ignore:start */
    <div>
      <span className='dark block pad1x space-bottom1'>Account</span>
      <div id='user-stuff' className='space-bottom2 col12 clearfix mobile-cols'>
        <a className='block truncate strong small col6 pad1x pad0y dark' target='_blank' href='http://www.openstreetmap.org/user/username' title='Profile on OpenStreetMap'>
          <img className='dot avatar' src='' />
          username
        </a>
        <div className='col6 pad1x text-right'>
          <a href='#' className='js-logout rcon logout button small'>Logout</a>
        </div>
        <div className='pad1x'>
          <a href='#' onClick={actions.userLogin} className='js-login icon account button small'>login to edit</a>
        </div>
      </div>
    </div>
    /* jshint ignore:end */
    );
  }
});
