import { createSelector } from 'reselect';

const modalsSelector = state => state.modals;

const ModalsSelectors = {
  getShowSettingsModal: createSelector(modalsSelector, (state) => state.showSettingsModal),
  getShowSuccessModal: createSelector(modalsSelector, (state) => state.showSuccessModal),
  getSuccessMessage: createSelector(modalsSelector, (state) => state.successMessage),
  getShowErrorModal: createSelector(modalsSelector, (state) => state.showErrorModal),
  getErrorMessage: createSelector(modalsSelector, (state) => state.errorMessage),
};

export default ModalsSelectors;
