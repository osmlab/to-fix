import SettingsConstants from '../constants/settings_constants';

export const toggleSidebar = () => ({
  type: SettingsConstants.SETTINGS_TOGGLE_SIDEBAR
});

export const setEditorPreference = (editor) => ({
  type: SettingsConstants.SETTINGS_SET_EDITOR_PREFERENCE,
  editor,
});
