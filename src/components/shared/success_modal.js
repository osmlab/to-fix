import React, { PropTypes } from 'react';
import KeyBinding from 'react-keybinding';
import { connect } from 'react-redux';

import ModalsActionCreators from '../../stores/modals_action_creators';
import ModalsSelectors from '../../stores/modals_selectors';

const mapStateToProps = (state) => ({
  showSuccessModal: ModalsSelectors.getShowSuccessModal(state),
  successMessage: ModalsSelectors.getSuccessMessage(state),
});

const mapDispatchToProps = {
  closeSuccessModal: ModalsActionCreators.closeSuccessModal,
};

let SuccessModal = React.createClass({
  propTypes: {
    showSuccessModal: PropTypes.bool.isRequired,
    successMessage: PropTypes.string,
    closeSuccessModal: PropTypes.func.isRequired,
  },

  mixins: [KeyBinding],

  keybindings: {
    'esc': function(e) {
      this.props.closeSuccessModal();
    },
  },

  render() {
    const { showSuccessModal, successMessage, closeSuccessModal } = this.props;

    const isActive = showSuccessModal ? 'active' : '';
    const modalClass = `animate modal modal-content ${isActive}`;

    return (
      <div className={modalClass}>
        <div className='col4 modal-body fill-green contain'>
          <button className='unround pad1 icon fr close button quiet' onClick={closeSuccessModal} />
          <div className='pad2 dark'>
            <h2>Success</h2>
            <strong>{successMessage}</strong>
          </div>
        </div>
      </div>
    );
  }
});

SuccessModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(SuccessModal);

export default SuccessModal;
