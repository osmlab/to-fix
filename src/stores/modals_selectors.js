import { createSelector } from 'reselect';

const modalsSelector = state => state.modals;

const ModalsSelectors = {
  getShowSettingsModal: createSelector(modalsSelector, (state) => state.showSettings),
  getShowErrorModal: createSelector(modalsSelector, (state) => state.showError),
  getErrorMessage: createSelector(modalsSelector, (state) => state.errorMessage),
};

export default ModalsSelectors;
