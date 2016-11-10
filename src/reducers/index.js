import { combineReducers } from 'redux';

import user, * as fromUser from './user';
import settings, * as fromSettings from './settings';
import tasks, * as fromTasks from './tasks';
import items, * as fromItems from './items';
import activity, * as fromActivity from './activity';
import stats, * as fromStats from './stats';
import modals, * as fromModals from './modals';

export default combineReducers({
  user,
  settings,
  tasks,
  items,
  activity,
  stats,
  modals,
});

// User state
export const getIsAuthenticated = (state) => fromUser.getIsAuthenticated(state.user);
export const getUsername = (state) => fromUser.getUsername(state.user);
export const getOsmId = (state) => fromUser.getOsmId(state.user);
export const getAvatar = (state) => fromUser.getAvatar(state.user);

// Settings state
export const getSidebarSetting = (state) => fromSettings.getSidebar(state.settings);
export const getEditorSetting = (state) => fromSettings.getEditor(state.settings);

// Tasks state
export const getTasksIsFetching = (state) => fromTasks.getIsFetching(state.tasks);
export const getTasksError = (state) => fromTasks.getError(state.tasks);
export const getAllTasks = (state) => fromTasks.getAllTasks(state.tasks);
export const getCompletedTasks = (state) => fromTasks.getCompletedTasks(state.tasks);
export const getActiveTasks = (state) => fromTasks.getActiveTasks(state.tasks);
export const getCurrentTask = (state) => fromTasks.getCurrentTask(state.tasks);
export const getTaskSummary = (state) => fromTasks.getTaskSummary(state.tasks);

// Items state
export const getCurrentItem = (state) => fromItems.getCurrentItem(state.items);
export const getCurrentItemId = (state) => fromItems.getCurrentItemId(state.items);
export const getItemIsFetching = (state) => fromItems.getIsFetching(state.items);
export const getItemError = (state) => fromItems.getError(state.items);

// Activity state
export const getActivityIsFetching = (state) => fromActivity.getIsFetching(state.activity);
export const getActivityError = (state) => fromActivity.getError(state.activity);
export const getActivityData = (state) => fromActivity.getData(state.activity);
export const getActivityFrom = (state) => fromActivity.getFrom(state.activity);
export const getActivityTo = (state) => fromActivity.getTo(state.activity);
export const getActivityUpdated = (state) => fromActivity.get(state.activity);

// Stats state
export const getStatsIsFetching = (state) => fromStats.getIsFetching(state.stats);
export const getStatsError = (state) => fromStats.getError(state.stats);
export const getStatsByUser = (state) => fromStats.getByUser(state.stats);
export const getStatsByDate = (state) => fromStats.getByDate(state.stats);
export const getStatsFrom = (state) => fromStats.getFrom(state.stats);
export const getStatsTo = (state) => fromStats.getTo(state.stats);
export const getStatsUpdated = (state) => fromStats.getUpdated(state.stats);

// Modals state
export const getShowSettingsModal = (state) => fromModals.getShowSettings(state.modals);
export const getShowErrorModal = (state) => fromModals.getShowError(state.modals);
export const getErrorMessage = (state) => fromModals.getErrorMessage(state.modals);
