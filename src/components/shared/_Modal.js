import React from 'react';
import Reflux from 'reflux';

import actions from '../../actions/actions';

import Settings from './modals/settings';

const Modal = React.createClass({
  mixins: [
    Reflux.listenTo(actions.openSettings, 'openSettings')
  ],

  getInitialState: function() {
    return {
      settingsModal: null
    };
  },

  openSettings: function() { this.setState({ settingsModal: true }); },

  closeModal: function() {
    this.setState({
      settingsModal: null
    });
  },

  render: function () {
    return (
      <div>
        {(this.state.settingsModal) ?
          (<Settings onClose={this.closeModal}/>) : ''}
      </div>
    );
  }
});

export default Modal;
