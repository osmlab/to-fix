const initialState = {
  sidebar: true,
  editor: 'id',
};

const isSettingsAction = /^settings/;

const settings = (state = initialState, action) => {
  if (!isSettingsAction.test(action.type)) return state;

  const type = action.type.substring('settings/'.length);
  switch(type) {
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebar: !state.sidebar,
      };
    case 'SET_EDITOR_PREFERENCE':
      return {
        ...state,
        editor: action.editor,
      };
    default:
      return state;
  }
};

export default settings;
