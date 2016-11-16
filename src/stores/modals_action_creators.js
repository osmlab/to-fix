import ModalsConstants from '../constants/modals_constants';

const ModalsActionCreators = {
  openSettingsModal: () => ({
    type: ModalsConstants.MODALS_OPEN_SETTINGS,
  }),

  closeSettingsModal: () => ({
    type: ModalsConstants.MODALS_CLOSE_SETTINGS,
  }),

  openSuccessModal: (successMessage) => ({
    type: ModalsConstants.MODALS_OPEN_SUCCESS,
    successMessage,
  }),

  closeSuccessModal: () => ({
    type: ModalsConstants.MODALS_CLOSE_SUCCESS,
  }),

  openErrorModal: (errorMessage) => ({
    type: ModalsConstants.MODALS_OPEN_ERROR,
    errorMessage,
  }),

  closeErrorModal: () => ({
    type: ModalsConstants.MODALS_CLOSE_ERROR,
  }),
};

export default ModalsActionCreators;
