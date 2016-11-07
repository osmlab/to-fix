import * as store from '../util/localStorage';

if (!store.get('sidebar')) {
  store.set('sidebar', true);
}

if (!store.get('editor')) {
  store.set('editor', 'id');
}

const initialState = {
  sidebar: store.get('sidebar'),
  editor: store.get('editor'),
};

const isSettingsAction = /^settings/;

const settings = (state = initialState, action) => {
  if (!isSettingsAction.test(action.type)) return state;

  switch(action.type) {
    case 'settings/TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebar: !state.sidebar,
      };
    case 'settings/SET_EDITOR_PREFERENCE':
      return {
        ...state,
        editor: action.editor,
      };
    default:
      return state;
  }
};

export default settings;

// Selectors
export const getSidebar = (state) => state.sidebar;
export const getEditor = (state) => state.editor;
