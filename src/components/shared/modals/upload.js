'use strict';

var React = require('react');
var Keys = require('react-keybinding');
var store = require('store');
var $ = require('jquery');
var actions = require('../../../actions/actions');
var config = require('../../../config');

module.exports = React.createClass({
  mixins: [Keys],
   getInitialState: function() {
    return {confirm:{status:false,taskname:null}};
   },
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

  stopProp: function(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  },

  uploadData: function(e) {
    e.preventDefault();
    var self = this;
    // TODO sanitize/validation
    var formData = new window.FormData();
    var file = this.refs.fileInput.getDOMNode();
    var name = this.refs.taskname.getDOMNode().value.trim();
    var password = this.refs.password.getDOMNode().value.trim();
    file = file.files[0];
      // not sure why this doesn't work when assigned directly to file the first time

    formData.append('file', file);
    formData.append('name', name);
    formData.append('password', password);
    //actions.uploadTasks(formData);
    $.ajax({
      url: config.taskServer + 'csv',
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(data) {
        self.setState({
          startupload: true,
          status: true
        });
        self.cleanup();
      },
      error: function(xhr, status, err) {
        self.setState({
          startupload: true,
          status: false
        });
        self.cleanup();
      }
    });
    },
  cleanup: function() {
    var self = this;
    setTimeout(function() {
      self.setState({
        startupload: false,
        status: false
      });
    }, 3000);
  },

  render: function() {
    var editor = (store.get('editor')) ? store.get('editor') : 'ideditor';

    return (
      /* jshint ignore:start */
      <div id='modal' className='animate modal modal-content active' onClick={this.onCancel}>
        <div className='col4 modal-body fill-purple contain' onClick={this.stopProp}>
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
              <a onClick={this.triggerFileInput} className='button pad2x  quiet'>Choose CSV</a>
            </fieldset>

            <div className='pad2x pad1y fill-light round-bottom col12 clearfix'>
              <input className='col6 margin3 button' type='submit' value='Upload file' />
            </div>
          </form>
          <div>{(this.state.startupload) ? 
            ((this.state.status) ? (<h2 className='dark'>succesful upload </h2>) : (<h2 className='dark'>unsuccefull</h2>)) : ''}
          </div> 
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});
