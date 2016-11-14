import { createSelector } from 'reselect';

const settingsSelector = state => state.settings;

const SettingsSelectors = {
  getSidebarSetting: createSelector(settingsSelector, (state) => state.sidebar),
  getEditorSetting: createSelector(settingsSelector, (state) => state.editor),
};

export default SettingsSelectors;
