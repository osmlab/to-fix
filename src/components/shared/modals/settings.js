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

  setEditor: function(e) {
    var editor = e.target.getAttribute('id');
    actions.editorPreference(editor);
  },

  stopProp: function(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  },

  render: function() {
    var editor = (store.get('editor')) ? store.get('editor') : 'ideditor';

    return (
      /* jshint ignore:start */
      <div id='modal' className='animate modal modal-content active' onClick={this.onCancel}>
        <div className='col4 modal-body fill-purple contain' onClick={this.stopProp}>
          <button onClick={this.props.onClose} className='unround pad1 icon fr close button quiet'></button>
          <div className='pad2'>
            <h2 className='dark'>Settings</h2>
          </div>

          <fieldset className='pad2x space-bottom2 dark'>
            <label className='quiet block space-bottom0'>Default editor</label>
            <form onChange={this.setEditor} className='radio-pill pill clearfix col12'>
              <input type='radio' name='editorpref' id='ideditor' defaultChecked={editor === 'ideditor'} />
              <label htmlFor='ideditor' className='col6 button quiet icon check'>iD editor</label>
              <input type='radio' name='editorpref' id='josm' defaultChecked={editor === 'josm'} />
              <label htmlFor='josm' className='col6 button quiet icon check'>JOSM editor*</label>
            </form>
          </fieldset>

          <div className='pad2x space-bottom2 dark'>
            Shortcut keys: <span className='quiet'><code className='fill-darken1'>e</code> Edit <code className='fill-darken1'>s</code> Skip <code className='fill-darken1'>n</code> Not an error <code className='fill-darken1'>f</code> Fixed</span>
            <small className='quiet'>*JOSM requires <a target='_blank' href='http://josm.openstreetmap.de/wiki/Help/Preferences/RemoteControl/'>remote control</a> to be set in preferences.</small>
          </div>

          <div className='pad2x pad1y fill-light round-bottom text-right'>
            <button onClick={this.userLogout} className='rcon logout button quiet animate'>Logout</button>
          </div>
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});
