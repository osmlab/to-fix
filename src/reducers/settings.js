const initialState = {
  sidebar: true,
  editor: 'id',
};

const settings = (state = initialState, action) => {
  switch(action.type) {
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
