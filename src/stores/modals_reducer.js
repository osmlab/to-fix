import ModalsConstants from '../constants/modals_constants';

const initialState = {
  showSettingsModal: false,
  showSuccessModal: false,
  successMessage: null,
  showErrorModal: false,
  errorMessage: null,
  showCreateTaskModal: false,
  showManageUsersModal: false,
};

const modals = (state = initialState, action) => {
  switch(action.type) {
    case ModalsConstants.MODALS_OPEN_SETTINGS:
      return {
        ...state,
        showSettingsModal: true,
      };
    case ModalsConstants.MODALS_CLOSE_SETTINGS:
      return {
        ...state,
        showSettingsModal: false,
      };
    case ModalsConstants.MODALS_OPEN_SUCCESS:
      return {
        ...state,
        showSuccessModal: true,
        successMessage: action.successMessage,
      };
    case ModalsConstants.MODALS_CLOSE_SUCCESS:
      return {
        ...state,
        showSuccessModal: false,
        successMessage: null,
      };
    case ModalsConstants.MODALS_OPEN_ERROR:
      return {
        ...state,
        showErrorModal: true,
        errorMessage: action.errorMessage,
      };
    case ModalsConstants.MODALS_CLOSE_ERROR:
      return {
        ...state,
        showErrorModal: false,
        errorMessage: null,
      };
    case ModalsConstants.MODALS_OPEN_CREATE_TASK:
      return {
        ...state,
        showCreateTaskModal: true,
      };
    case ModalsConstants.MODALS_CLOSE_CREATE_TASK:
      return {
        ...state,
        showCreateTaskModal: false,
      };
    case ModalsConstants.MODALS_OPEN_MANAGE_USERS:
      return {
        ...state,
        showManageUsersModal: true,
      };
    case ModalsConstants.MODALS_CLOSE_MANAGE_USERS:
      return {
        ...state,
        showManageUsersModal: false,
      };
    default:
      return state;
  }
}

export default modals;
