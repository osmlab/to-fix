'use strict';

var React = require('react');
var Keys = require('react-keybinding');
var store = require('store');
var actions = require('../../../actions/actions');

module.exports = React.createClass({
  mixins: [Keys],

  propTypes: {
    onClose: React.PropTypes.func
  },

  keybindings: {
    'esc': function(e) {
      this.onCancel(e);
    }
  },

  onCancel: function(e) {
    this.props.onClose(e);
  },

  userLogout: function(e) {
    this.props.onClose(e);
    actions.userLogout();
  },

  triggerFileInput: function() {
    this.refs.fileInput.getDOMNode().click(); 
  },

  uploadData: function(e) {
    e.preventDefault();
    // TODO sanitize/validation
    var formData = new window.FormData();
    var file = this.refs.fileInput.getDOMNode().files[0];
    var name = this.refs.taskname.getDOMNode().value.trim();
    var password = this.refs.password.getDOMNode().value.trim();

    formData.append('file', file);
    formData.append('name', name);
    formData.append('password', password);
    actions.uploadTasks(formData);
  },

  render: function() {
    var editor = (store.get('editor')) ? store.get('editor') : 'ideditor';

    return (
      /* jshint ignore:start */
      <div id='modal' className='animate modal modal-content active'>
        <div className='col4 modal-body fill-navy contain'>
          <button onClick={this.props.onClose} className='unround pad1 icon fr close button quiet'></button>
          <div className='pad2'>
            <h2 className='dark'>Upload</h2>
          </div>

          <form className='dark' onSubmit={this.uploadData}>
            <fieldset className='pad2x'>
              <label>Task name</label>
              <input className='col12 block clean' ref='taskname' type='text' name='name' placeholder='Task name' />
            </fieldset>
            <fieldset className='pad2x'>
              <label>Password</label>
              <input className='col12 block clean' ref='password' type='password' name='uploadPassword' placeholder='Password' />
            </fieldset>
            <fieldset className='pad2x'>
              <input type='file' className='hidden' ref='fileInput' name='uploadfile' />
              <button onClick={this.triggerFileInput} className='button pad2x  quiet'>Choose CSV</button>
            </fieldset>

            <div className='pad2x pad1y fill-light round-bottom col12 clearfix'>
              <input className='col6 margin3' type='submit' value='Upload' />
            </div>
          </form>
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});
