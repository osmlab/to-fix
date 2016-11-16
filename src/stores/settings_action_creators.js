import SettingsConstants from '../constants/settings_constants';

const SettingsActionCreators = {
  toggleSidebar: () => ({
    type: SettingsConstants.SETTINGS_TOGGLE_SIDEBAR
  }),

  setEditorPreference: (editor) => ({
    type: SettingsConstants.SETTINGS_SET_EDITOR_PREFERENCE,
    editor,
  }),
};

export default SettingsActionCreators;
