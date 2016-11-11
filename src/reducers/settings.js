import * as store from '../utils/local_storage';

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

const settings = (state = initialState, action) => {
  switch(action.type) {
    case 'settings/TOGGLE_SIDEBAR':
      store.set('sidebar', !state.sidebar);
      return {
        ...state,
        sidebar: !state.sidebar,
      };
    case 'settings/SET_EDITOR_PREFERENCE':
      store.set('editor', action.editor);
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
