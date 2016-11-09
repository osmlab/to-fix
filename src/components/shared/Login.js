import React, { Component } from 'react';
import { connect } from 'react-redux';

import { USER_PROFILE_URL } from '../../config';
import { userLogin, getUserDetails, openSettingsModal } from '../../actions';
import { getAuthenticated, getUsername, getOsmId, getAvatar} from '../../reducers';

class Login extends Component {
  componentDidMount() {
    const { authenticated, getUserDetails } = this.props;
    if (authenticated) getUserDetails();
  }

  onLoginClick = () => {
    const { userLogin, getUserDetails } = this.props;
    userLogin().then(getUserDetails);
  }

  renderLoginState() {
    const { authenticated, username, avatar, openSettingsModal } = this.props;
    const profileURL = `${USER_PROFILE_URL}/${username}`;

    if (authenticated) {
      return (
        <div className='pad1x col12 truncate clearfix mobile-cols'>
          <div className='pad0y col6'>
            <a className='strong small dark' target='_blank' href={profileURL} title='Profile on OpenStreetMap'>
              <img className='dot avatar' src={avatar} role='presentation' />
              {username}
            </a>
          </div>
          <button onClick={openSettingsModal} className='col6 icon sprocket button quiet small animate'>Settings</button>
        </div>
      );
    } else {
      return (
        <div className='pad1x'>
          <button onClick={this.onLoginClick} className='icon osm button small col12 animate'>Authorize on OSM</button>
        </div>
      );
    }
  }
  render() {
    return (
      <div className='space-bottom1'>
        <h4 className='dark block pad1x space-bottom1'>Account</h4>
        <div id='user-stuff' className='space-bottom1 col12 clearfix mobile-cols'>
          {this.renderLoginState()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authenticated: getAuthenticated(state),
  username: getUsername(state),
  osmid: getOsmId(state),
  avatar: getAvatar(state),
});

Login = connect(
  mapStateToProps,
  { userLogin, getUserDetails, openSettingsModal }
)(Login);

export default Login;
