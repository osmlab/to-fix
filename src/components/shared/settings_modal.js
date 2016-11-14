import React from 'react';
import KeyBinding from 'react-keybinding';
import { connect } from 'react-redux';

import SettingsSelectors from '../../stores/settings_selectors';
import ModalsSelectors from '../../stores/modals_selectors';
import UserActionCreators from '../../stores/user_action_creators';
import SettingsActionCreators from '../../stores/settings_action_creators';
import ModalsActionCreators from '../../stores/modals_action_creators';

const mapStateToProps = (state) => ({
  editor: SettingsSelectors.getEditorSetting(state),
  showSettingsModal: ModalsSelectors.getShowSettingsModal(state),
});

const mapDispatchToProps = {
  logout: UserActionCreators.logout,
  setEditorPreference: SettingsActionCreators.setEditorPreference,
  closeSettingsModal: ModalsActionCreators.closeSettingsModal,
};

let SettingsModal = React.createClass({
  mixins: [KeyBinding],

  keybindings: {
    'esc': function(e) {
      this.props.closeSettingsModal();
    },
  },

  logout(e) {
    this.props.closeSettingsModal(e);
    this.props.logout();
  },

  setEditor(e) {
    var editor = e.target.getAttribute('id');
    this.props.setEditorPreference(editor);
  },

  stopProp(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  },

  render() {
    const { editor, showSettingsModal, closeSettingsModal } = this.props;

    if (showSettingsModal) {
      return (
        <div className='animate modal modal-content active' onClick={closeSettingsModal}>
          <div className='col4 modal-body fill-purple contain' onClick={this.stopProp}>
            <button onClick={closeSettingsModal} className='unround pad1 icon fr close button quiet'></button>
            <div className='pad2'>
              <h2 className='dark'>Settings</h2>
            </div>

            <fieldset className='pad2x space-bottom2 dark'>
              <label className='quiet block space-bottom0'>Default editor</label>
              <form onChange={this.setEditor} className='radio-pill pill clearfix col12'>
                <input type='radio' name='editorpref' id='id' defaultChecked={editor === 'id'} />
                <label htmlFor='id' className='col6 button quiet icon check'>iD editor</label>
                <input type='radio' name='editorpref' id='josm' defaultChecked={editor === 'josm'} />
                <label htmlFor='josm' className='col6 button quiet icon check'>JOSM editor*</label>
              </form>
            </fieldset>

            <div className='pad2x space-bottom2 dark'>
              Shortcut keys: <span className='quiet'><code className='fill-darken1'>e</code> Edit <code className='fill-darken1'>s</code> Skip <code className='fill-darken1'>n</code> Not an error <code className='fill-darken1'>f</code> Fixed</span>
              <small className='quiet'>*JOSM requires <a target='_blank' href='http://josm.openstreetmap.de/wiki/Help/Preferences/RemoteControl/'>remote control</a> to be set in preferences.</small>
            </div>

            <div className='pad2x pad1y fill-light round-bottom text-right'>
              <button onClick={this.logout} className='rcon logout button quiet animate'>Logout</button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
});

SettingsModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsModal);

export default SettingsModal;
