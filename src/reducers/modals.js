const isModalsAction = /^modals/;

const initialState = {
  showSettings: false,
  showError: false,
  errorMessage: null,
};

const modals = (state = initialState, action) => {
  if (!isModalsAction.test(action.type)) return state;

  switch(action.type) {
    case 'modals/OPEN_SETTINGS':
      return {
        ...state,
        showSettings: true,
      };
    case 'modals/CLOSE_SETTINGS':
      return {
        ...state,
        showSettings: false,
      };
    case 'modals/OPEN_ERROR':
      return {
        ...state,
        showError: true,
        errorMessage: action.error,
      };
    case 'modals/CLOSE_ERROR':
      return {
        ...state,
        showError: false,
        errorMessage: null,
      };
    default:
      return state;
  }
}

export default modals;

// Selectors
export const getShowSettings = (state) => state.showSettings;
export const getShowError = (state) => state.showError;
export const getErrorMessage = (state) => state.errorMessage;
