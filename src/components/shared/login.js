import React from 'react';
import Reflux from 'reflux';

import * as config from '../../config';
import userStore from '../../stores/user_store';
import actions from '../../actions/actions';

const Login = React.createClass({
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
        <div className='pad1x col12 truncate clearfix mobile-cols'>
          <div className='pad0y col6'>
            <a className='strong small dark' target='_blank' href={profile} title='Profile on OpenStreetMap'>
              <img className='dot avatar' src={user.avatar} />
              {user.username}
            </a>
          </div>
          <button onClick={actions.openSettings} className='col6 icon sprocket button quiet small animate'>Settings</button>
        </div>
      );
    } else {
      logState = (
        <div className='pad1x'>
          <button onClick={actions.userLogin} className='icon osm button small col12 animate'>Authorize on OSM</button>
        </div>
      );
    }

    return (
      <div className='space-bottom1'>
        <h4 className='dark block pad1x space-bottom1'>Account</h4>
        <div id='user-stuff' className='space-bottom1 col12 clearfix mobile-cols'>
          {logState}
        </div>
      </div>
    );
  }
});

export default Login;
