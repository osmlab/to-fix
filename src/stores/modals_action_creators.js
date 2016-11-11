import ModalsConstants from '../constants/modal_constants';

export const openSettingsModal = () => ({
  type: ModalsConstants.MODALS_OPEN_SETTINGS,
});

export const closeSettingsModal = () => ({
  type: ModalsConstants.MODALS_CLOSE_SETTINGS,
});

export const openErrorModal = (error) => ({
  type: ModalsConstants.MODALS_OPEN_ERROR,
  error,
});

export const closeErrorModal = () => ({
  type: ModalsConstants.MODALS_CLOSE_ERROR,
});
