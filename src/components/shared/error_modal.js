import React, { PropTypes } from 'react';
import KeyBinding from 'react-keybinding';
import { connect } from 'react-redux';

import ModalsActionCreators from '../../stores/modals_action_creators';
import ModalsSelectors from '../../stores/modals_selectors';

const mapStateToProps = (state) => ({
  showErrorModal: ModalsSelectors.getShowErrorModal(state),
  errorMessage: ModalsSelectors.getErrorMessage(state),
});

const mapDispatchToProps = {
  closeErrorModal: ModalsActionCreators.closeErrorModal,
};

let ErrorModal = React.createClass({
  propTypes: {
    showErrorModal: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string,
    closeErrorModal: PropTypes.func.isRequired,
  },

  mixins: [KeyBinding],

  keybindings: {
    esc(e) {
      this.props.closeErrorModal();
    },
  },

  render() {
    const { showErrorModal, errorMessage, closeErrorModal } = this.props;

    if (showErrorModal) {
      return (
        <div className='pin-bottomleft z1000 offcanvas-bottom animate pad1 col12 active'>
          <div className='fill-orange round col3 quiet dialog'>
            <button onClick={closeErrorModal} className='icon fr close button quiet'></button>
            <div className='pad1'>
              <strong className='icon alert'>{errorMessage}</strong>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
});

ErrorModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorModal);

export default ErrorModal;
