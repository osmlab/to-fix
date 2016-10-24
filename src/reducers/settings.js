const initialState = {
  sidebar: true,
  editor: 'id',
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
