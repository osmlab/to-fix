import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { USER_PROFILE_URL, TASK_SERVER_URL } from '../../config';
import UserActionCreators from '../../stores/user_action_creators';
import UserSelectors from '../../stores/user_selectors';
import ModalsActionCreators from '../../stores/modals_action_creators';

const mapStateToProps = (state) => ({
  isAuthenticated: UserSelectors.getIsAuthenticated(state),
  username: UserSelectors.getUsername(state),
  osmid: UserSelectors.getOsmId(state),
  avatar: UserSelectors.getAvatar(state),
});

const mapDispatchToProps = {
  login: UserActionCreators.login,
  openSettingsModal: ModalsActionCreators.openSettingsModal,
};

class Login extends Component {
  onLoginClick = () => {
    const { login } = this.props;

    const popup = this.createPopup(600, 550, 'oauth_popup');
    popup.location = `${TASK_SERVER_URL}/connect/openstreetmap`;

    window.authComplete = (location) => {
      const queryString = location.split('?')[1];
      const creds = this.parseQueryString(queryString);
      login(creds);

      delete window.authComplete;
    }
  }

  createPopup(width, height, title) {
    const settings = [
      ['width', width], ['height', height],
      ['left', screen.width / 2 - width / 2],
      ['top', screen.height / 2 - height / 2]
    ].map(x => x.join('='))
     .join(',');

    const popup = window.open('about:blank', title, settings);
    return popup;
  }

  parseQueryString(queryString) {
    const query = {};

    queryString.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      query[decodeURIComponent(key)] = decodeURIComponent(value) || null;
    });

    return query;
  }

  renderLoginState() {
    const { isAuthenticated, username, avatar, openSettingsModal } = this.props;
    const profileURL = `${USER_PROFILE_URL}/${username}`;

    if (isAuthenticated) {
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
    }

    return (
      <div className='pad1x'>
        <button onClick={this.onLoginClick} className='icon osm button small col12 animate'>Authorize on OSM</button>
      </div>
    );
  }

  render() {
    const loginState = this.renderLoginState();

    return (
      <div className='space-bottom1'>
        <h4 className='dark block pad1x space-bottom1'>Account</h4>
        <div id='user-stuff' className='space-bottom1 col12 clearfix mobile-cols'>
          {loginState}
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  username: PropTypes.string,
  osmid: PropTypes.string,
  avatar: PropTypes.string,
  login: PropTypes.func.isRequired,
  openSettingsModal: PropTypes.func.isRequired,
};

Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default Login;
