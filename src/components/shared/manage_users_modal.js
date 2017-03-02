import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { USER_PROFILE_URL } from '../../config';
import { ROLES } from '../../constants/user_constants';
import { AsyncStatus } from '../../stores/async_action';
import UserSelectors from '../../stores/user_selectors';
import ModalsSelectors from '../../stores/modals_selectors';
import ModalsActionCreators from '../../stores/modals_action_creators';
import AdminSelectors from '../../stores/admin_selectors';
import AdminActionCreators from '../../stores/admin_action_creators';

const mapStateToProps = (state) => ({
  showManageUsersModal: ModalsSelectors.getShowManageUsersModal(state),
  users: AdminSelectors.getUsers(state),
  token: UserSelectors.getToken(state),
});

const mapDispatchToProps = {
  closeManageUsersModal: ModalsActionCreators.closeManageUsersModal,
  fetchAllUsers: AdminActionCreators.fetchAllUsers,
  changeUserRole: AdminActionCreators.changeUserRole,
};

class ManageUsersModal extends Component {
  initialState = {
    isLoading: false,
    isSuccess: false,
    isFailure: false,
    errorMessage: '',
  }

  state = this.initialState

  resetAsyncState = () => {
    this.setState(this.initialState);
  }

  componentDidUpdate() {
    const { showManageUsersModal, users } = this.props;

    if (showManageUsersModal && users.length === 0) {
      const { fetchAllUsers, token } = this.props;
      fetchAllUsers({ token })
    }
  }

  stopProp = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  handleChange = (e, userID) => {
    e.preventDefault();

    const { changeUserRole, token } = this.props;

    this.resetAsyncState();
    this.setState({ isLoading: true });

    changeUserRole({token, payload: { iduser: userID, role: e.target.value }})
      .then(response => {
        this.setState({ isLoading: false });

        if (response.status === AsyncStatus.SUCCESS) {
          this.setState({
            isSuccess: true,
          });
        } else {
          this.setState({
            isFailure: true,
            errorMessage: response.error,
          });
        }
      });
  }

  renderNotice = () => {
    const { isSuccess, isFailure, errorMessage } = this.state;

    if (isSuccess) {
      return (
        <div className='pad2 note contain'>
          <h3>Success</h3>
          <p>User role changed successfully.</p>
        </div>
      );
    }

    if (isFailure) {
      return (
        <div className='pad2 note error contain truncate'>
          <h3>Error</h3>
          <p>{errorMessage || 'Something went wrong.'}</p>
        </div>
      );
    }

    return null;
  }

  renderUser = ({ user: username, img, role, id }, key) => (
    <div key={key} className='col12 clearfix pad4x'>
      <div className='col4'>
        <div className='clearfix round align-top stroke avatar-wrap clip dark space-bottom1 inline'>
          <a href={`${USER_PROFILE_URL}/${username}`} target='_blank' className='align-top inline clearfix fill-lighten1 pad2x pad1y strong' onClick={this.openUserMenu}>
            <span title={username} className='fl truncate'>{username}</span>
          </a>
        </div>
      </div>
      <div className='col4 margin2 select-container'>
        <select value={role} className='select fill-lighten0 row1 width24' onChange={(e) => this.handleChange(e, id)}>
          <option value={ROLES.EDITOR}>Editor</option>
          <option value={ROLES.ADMIN}>Admin</option>
          <option value={ROLES.SUPERADMIN}>Superadmin</option>
        </select>
      </div>
    </div>
  );

  render() {
    const { showManageUsersModal, closeManageUsersModal, users } = this.props;

    if (showManageUsersModal && users.length !== 0) {
      const loadingClass = this.state.isLoading ? 'loading' : '';
      const modalClass = `animate modal modal-content active ${loadingClass}`;

      const notice = this.renderNotice();

      return (
        <div className={modalClass} onClick={closeManageUsersModal}>
          <div className='col4 modal-body fill-purple contain' onClick={this.stopProp}>
            <button onClick={closeManageUsersModal} className='unround pad1 icon fr close button quiet'></button>
            <div className='col12 pad2'>
              <h2 className='dark'>Change user roles</h2>
            </div>
            {notice}
            <div className='col12 pad2 scroll-styled' style={{height: '60vh'}}>
              {users.map(this.renderUser)}
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
}

ManageUsersModal.propTypes = {
  showManageUsersModal: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired,
  token: PropTypes.string,
  closeManageUsersModal: PropTypes.func.isRequired,
  fetchAllUsers: PropTypes.func.isRequired,
  changeUserRole: PropTypes.func.isRequired,
};

ManageUsersModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageUsersModal);

export default ManageUsersModal;
