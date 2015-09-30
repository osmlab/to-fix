'use strict';

var React = require('react');
var Reflux = require('reflux');
var actions = require('../../actions/actions');

// Modals
var Settings = require('./modals/settings');

module.exports = React.createClass({
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
      /* jshint ignore:start */
      <div>
        {(this.state.settingsModal) ?
          (<Settings onClose={this.closeModal}/>) : ''}
      </div>
      /* jshint ignore:end */
    );
  }
});
