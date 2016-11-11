import * as safeStorage from '../utils/safe_storage';
import SettingsConstants from '../constants/settings_constants';

if (!safeStorage.get('sidebar')) {
  safeStorage.set('sidebar', true);
}

if (!safeStorage.get('editor')) {
  safeStorage.set('editor', 'id');
}

const initialState = {
  sidebar: safeStorage.get('sidebar'),
  editor: safeStorage.get('editor'),
};

const settings = (state = initialState, action) => {
  switch(action.type) {
    case SettingsConstants.SETTINGS_TOGGLE_SIDEBAR:
      // NOTE: This should not be part of the reducer
      safeStorage.set('sidebar', !state.sidebar);
      return {
        ...state,
        sidebar: !state.sidebar,
      };
    case SettingsConstants.SETTINGS_SET_EDITOR_PREFERENCE:
      // NOTE: This should not be part of the reducer
      safeStorage.set('editor', action.editor);
      return {
        ...state,
        editor: action.editor,
      };
    default:
      return state;
  }
};

export default settings;
