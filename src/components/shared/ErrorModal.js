import React from 'react';
import KeyBinding from 'react-keybinding';
import { connect } from 'react-redux';

import { closeErrorModal } from '../../actions';
import { getShowErrorModal, getErrorMessage } from '../../reducers';

let ErrorModal = React.createClass({
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

const mapStateToProps = (state) => ({
  showErrorModal: getShowErrorModal(state),
  errorMessage: getErrorMessage(state),
});

ErrorModal = connect(
  mapStateToProps,
  { closeErrorModal }
)(ErrorModal);

export default ErrorModal;
