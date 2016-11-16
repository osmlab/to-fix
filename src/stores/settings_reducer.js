import SettingsConstants from '../constants/settings_constants';

const initialState = {
  sidebar: true,
  editor: 'id',
};

const settings = (state = initialState, action) => {
  switch(action.type) {
    case SettingsConstants.SETTINGS_TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebar: !state.sidebar,
      };
    case SettingsConstants.SETTINGS_SET_EDITOR_PREFERENCE:
      return {
        ...state,
        editor: action.editor,
      };
    default:
      return state;
  }
};

export default settings;
