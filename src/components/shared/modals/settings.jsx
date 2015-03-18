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
    this.props.onClose(e);
  },

  render: function() {
    var editor = (store.get('editor')) ? store.get('editor') : 'ideditor';

    return (
      /* jshint ignore:start */
      <div id='modal' className='animate modal modal-content active'>
        <div className='col4 modal-body fill-navy-dark contain'>
          <button onClick={this.props.onClose} className='unround pad1 icon fr close button quiet'></button>
          <h1 className='pad2 title fancy dark'>Settings</h1>

          <fieldset className='pad2x space-bottom2 dark'>
            <label className='quiet block space-bottom0'>Default editor</label>
            <div className='radio-pill pill clearfix col12'>
              <input onChange={this.setEditor} type='radio' name='editorpref' id='ideditor' checked={editor === 'ideditor' && 'checked'} />
              <label htmlFor='ideditor' className='col6 button quiet icon check'>iD editor</label>
              <input onChange={this.setEditor} type='radio' name='editorpref' id='josm' checked={editor === 'josm' && 'checked'} />
              <label htmlFor='josm' className='col6 button quiet icon check'>JSOM editor</label>
            </div>
          </fieldset>

          <div className='pad2x pad1y fill-light round-bottom text-right'>
            <button onClick={this.userLogout} className='rcon logout button quiet animate'>Logout</button>
          </div>
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});
