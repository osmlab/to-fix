import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { ROLES } from '../../constants/user_constants';
import { server } from '../../services';
import UserActionCreators from '../../stores/user_action_creators';
import UserSelectors from '../../stores/user_selectors';
import ModalsActionCreators from '../../stores/modals_action_creators';
import TasksSelectors from '../../stores/tasks_selectors';

const mapStateToProps = (state) => ({
  isAuthenticated: UserSelectors.getIsAuthenticated(state),
  username: UserSelectors.getUsername(state),
  osmid: UserSelectors.getOsmId(state),
  avatar: UserSelectors.getAvatar(state),
  token: UserSelectors.getToken(state),
  role: UserSelectors.getRole(state),
  currentTaskId: TasksSelectors.getCurrentTaskId(state),
});

const mapDispatchToProps = {
  login: UserActionCreators.login,
  logout: UserActionCreators.logout,
  fetchUserDetails: UserActionCreators.fetchUserDetails,
  openSettingsModal: ModalsActionCreators.openSettingsModal,
};

class Login extends Component {
  state = {
    showUserMenu: false,
  }

  componentDidMount() {
    const { token, fetchUserDetails } = this.props;
    if (token) fetchUserDetails({ token });
  }

  onLoginClick = () => {
    const { login } = this.props;

    const popup = this.createPopup(600, 550, 'oauth_popup');
    popup.location = server.loginURL;

    window.authComplete = (location) => {
      const queryString = location.split('?')[1];
      const creds = this.parseQueryString(queryString);
      login(creds);

      delete window.authComplete;
    }
  }

  openUserMenu = (e) => {
    e.preventDefault();
    this.toggleUserMenu();
  }

  openSettingsModal = (e) => {
    e.preventDefault();
    this.toggleUserMenu();
    this.props.openSettingsModal();
  }

  logout = (e) => {
    e.preventDefault();
    this.toggleUserMenu();
    const { token } = this.props;
    this.props.logout({ token });
  }

  toggleUserMenu = (e) => {
    this.setState({
      showUserMenu: !this.state.showUserMenu,
    });
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
    const { isAuthenticated, username, avatar, role, currentTaskId } = this.props;

    const menuClass = `user-menu ${this.state.showUserMenu ? 'visible' : ''}`;

    if (isAuthenticated) {
      return (
        <div className='pad1x col12 clearfix mobile-cols'>
          <div className='pad0y col8 margin2'>
            <a className='block rcon caret-down strong small' href='#' onClick={this.openUserMenu}>
              <img className='dot avatar' src={avatar} role='presentation' />
              {username}
            </a>
            <ul className={menuClass}>
              <li>
                <a href='#' className='block pad0y pad2x icon sprocket' onClick={this.openSettingsModal}>Settings</a>
              </li>
              {
                (role === ROLES.ADMIN || role === ROLES.SUPERADMIN)
                  ? <li>
                     <Link
                       className='block pad0y pad2x icon pencil'
                       onClick={this.toggleUserMenu}
                       to={`admin/${currentTaskId}`}>
                       Manage tasks
                     </Link>
                   </li>
                 : null
              }
              {
                (role === ROLES.SUPERADMIN)
                  ? <li>
                    <a href='#' className='block pad0y pad2x icon lock' onClick={this.logout}>Manage users</a>
                   </li>
                 : null
              }
              <li>
                <a href='#' className='block pad0y pad2x icon logout' onClick={this.logout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className='pad1x'>
        <button onClick={this.onLoginClick} className='col12 button icon osm small animate truncate'>Login with OSM</button>
      </div>
    );
  }

  render() {
    const loginState = this.renderLoginState();

    return (
      <div id='user-stuff' className='col12 pad0y clearfix mobile-cols'>
        {loginState}
      </div>
    );
  }
}

Login.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  username: PropTypes.string,
  osmid: PropTypes.string,
  avatar: PropTypes.string,
  token: PropTypes.string,
  role: PropTypes.string,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  fetchUserDetails: PropTypes.func.isRequired,
  openSettingsModal: PropTypes.func.isRequired,
  currentTaskId: PropTypes.string.isRequired,
};

Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default Login;
