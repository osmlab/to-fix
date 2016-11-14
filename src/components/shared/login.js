import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { USER_PROFILE_URL } from '../../config';
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
  fetchUserDetails: UserActionCreators.fetchUserDetails,
  openSettingsModal: ModalsActionCreators.openSettingsModal,
};

class Login extends Component {
  componentDidMount() {
    const { isAuthenticated, fetchUserDetails } = this.props;
    if (isAuthenticated) fetchUserDetails();
  }

  onLoginClick = () => {
    const { login, fetchUserDetails } = this.props;
    login().then(fetchUserDetails);
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

Login.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  username: PropTypes.string,
  osmid: PropTypes.string,
  avatar: PropTypes.string,
  login: PropTypes.func.isRequired,
  fetchUserDetails: PropTypes.func.isRequired,
  openSettingsModal: PropTypes.func.isRequired,
};

Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default Login;
