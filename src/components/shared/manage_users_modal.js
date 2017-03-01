import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { AsyncStatus } from '../../stores/async_action';
import ModalsSelectors from '../../stores/modals_selectors';
import ModalsActionCreators from '../../stores/modals_action_creators';

const mapStateToProps = (state) => ({
  showManageUsersModal: ModalsSelectors.getShowManageUsersModal(state),
});

const mapDispatchToProps = {
  closeManageUsersModal: ModalsActionCreators.closeManageUsersModal,
};

class ManageUsersModal extends Component {
  initialState = {
    isLoading: false,
    isSuccess: false,
    isFailure: false,
    errorMessage: '',
  }

  state = this.initialState

  resetState = () => {
    this.setState(this.initialState);
  }

  stopProp = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { showManageUsersModal, closeManageUsersModal } = this.props;

    if (showManageUsersModal) {
      const loadingClass = this.state.isLoading ? 'loading' : '';
      const modalClass = `animate modal modal-content active ${loadingClass}`;

      return (
        <div className={modalClass} onClick={closeManageUsersModal}>
          <div className='col4 modal-body fill-purple contain' onClick={this.stopProp}>
            <button onClick={closeManageUsersModal} className='unround pad1 icon fr close button quiet'></button>
            <div className='pad2'>
              <h2 className='dark'>Change user roles</h2>
            </div>

            <div className='pad2 dark'>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
  closeManageUsersModal: PropTypes.func.isRequired,
};

ManageUsersModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageUsersModal);

export default ManageUsersModal;
