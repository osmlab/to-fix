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
    'esc': function(e) {
      this.props.closeErrorModal();
    },
  },

  render() {
    const { showErrorModal, errorMessage, closeErrorModal } = this.props;

    const isActive = showErrorModal ? 'active' : '';
    const modalClass = `animate modal modal-content ${isActive}`;

    return (
      <div className={modalClass}>
        <div className='col4 modal-body fill-pink contain'>
          <button className='unround pad1 icon fr close button quiet' onClick={closeErrorModal} />
          <div className='pad2 dark'>
            <h2 className='space-bottom0'>{'Error'}</h2>
            <strong>{errorMessage}</strong>
            <p className='space-top0'>
              Please report any issues at
              {' '}
              <a href='https://github.com/osmlab/to-fix/issues/new' target='_blank'>
                <code>github.com/osmlab/to-fix</code>.
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
});

ErrorModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorModal);

export default ErrorModal;
