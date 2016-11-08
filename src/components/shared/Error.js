import React from 'react';
import KeyBinding from 'react-keybinding';
import { connect } from 'react-redux';

import { closeError } from '../../actions';
import { getShowError, getErrorMessage } from '../../reducers';

let Error = React.createClass({
  mixins: [KeyBinding],

  keybindings: {
    'esc': function(e) {
      this.props.closeError();
    }
  },

  render() {
    const { showError, errorMessage, closeError } = this.props;

    if (!showError) return null;

    return (
      <div className='pin-bottomleft z1000 offcanvas-bottom animate pad1 col12 active'>
        <div className='fill-orange round col3 quiet dialog'>
          <button onClick={closeError} className='icon fr close button quiet'></button>
          <div className='pad1'>
            <strong className='icon alert'>{errorMessage}</strong>
          </div>
        </div>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  showError: getShowError(state),
  errorMessage: getErrorMessage(state),
});

Error = connect(
  mapStateToProps,
  { closeError }
)(Error);

export default Error;
