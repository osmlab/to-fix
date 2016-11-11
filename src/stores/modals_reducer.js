import ModalsConstants from '../constants/modal_constants';

const initialState = {
  showSettings: false,
  showError: false,
  errorMessage: null,
};

const modals = (state = initialState, action) => {
  switch(action.type) {
    case ModalsConstants.MODALS_OPEN_SETTINGS:
      return {
        ...state,
        showSettings: true,
      };
    case ModalsConstants.MODALS_CLOSE_SETTINGS:
      return {
        ...state,
        showSettings: false,
      };
    case ModalsConstants.MODALS_OPEN_ERROR:
      return {
        ...state,
        showError: true,
        errorMessage: action.error,
      };
    case ModalsConstants.MODALS_CLOSE_ERROR:
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
