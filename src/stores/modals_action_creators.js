import ModalsConstants from '../constants/modals_constants';

const ModalsActionCreators = {
  openSettingsModal: () => ({
    type: ModalsConstants.MODALS_OPEN_SETTINGS,
  }),

  closeSettingsModal: () => ({
    type: ModalsConstants.MODALS_CLOSE_SETTINGS,
  }),

  openErrorModal: (error) => ({
    type: ModalsConstants.MODALS_OPEN_ERROR,
    error,
  }),

  closeErrorModal: () => ({
    type: ModalsConstants.MODALS_CLOSE_ERROR,
  }),
};

export default ModalsActionCreators;
