'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var actions = require('../../actions/actions');

// Modals
var Upload = require('./modals/upload');
var Settings = require('./modals/settings');

module.exports = React.createClass({
  mixins: [
    Reflux.listenTo(actions.openSettings, 'openSettings'),
    Reflux.listenTo(actions.openUpload, 'openUpload')
  ],

  getInitialState: function() {
    return {
      settingsModal: null,
      UploadModal: null
    };
  },

  openSettings: function() { this.setState({ settingsModal: true }); },
  openUpload: function() { this.setState({ uploadModal: true }); },

  closeModal: function() {
    this.setState({
      settingsModal: null,
      uploadModal: null
    });
  },

  render: function () {
    var settingsModal = (this.state.settingsModal) ?
      (<Settings onClose={this.closeModal}/>) : '';

    var uploadModal = (this.state.uploadModal) ?
      (<Upload onClose={this.closeModal}/>) : '';

    return (
      /* jshint ignore:start */
      <div>
        {settingsModal}
        {uploadModal}
      </div>
      /* jshint ignore:end */
    );
  }
});
