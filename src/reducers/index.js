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
export const getAuthenticated = (state) => fromUser.getAuthenticated(state.user);
export const getUsername = (state) => fromUser.getUsername(state.user);
export const getOsmId = (state) => fromUser.getOsmId(state.user);
export const getAvatar = (state) => fromUser.getAvatar(state.user);

// Settings state
export const getSidebarSetting = (state) => fromSettings.getSidebar(state.settings);
export const getEditorSetting = (state) => fromSettings.getEditor(state.settings);

// Tasks state
export const getTasks = (state) => fromTasks.getTasks(state.tasks);
export const getTasksIsFetching = (state) => fromTasks.getIsFetching(state.tasks);
export const getCompletedTasks = (state) => fromTasks.getCompletedTasks(state.tasks);
export const getActiveTasks = (state) => fromTasks.getActiveTasks(state.tasks);
export const getCurrentTask = (state) => fromTasks.getCurrentTask(state.tasks);
export const getStatsSummary = (state) => fromTasks.getStatsSummary(state.tasks);

// Items state
export const getItems = (state) => fromItems.getItems(state.items);
export const getCurrentItem = (state) => fromItems.getCurrentItem(state.items);
export const getCurrentItemId = (state) => fromItems.getCurrentItemId(state.items);

// Activity state
export const getActivityData = (state) => fromActivity.getData(state.activity);

// Stats state
export const getStatsFrom = (state) => fromStats.getFrom(state.stats);
export const getStatsTo = (state) => fromStats.getTo(state.stats);
export const getStatsByUser = (state) => fromStats.getByUser(state.stats);
export const getStatsByDate = (state) => fromStats.getByDate(state.stats);

// Modals state
export const getShowSettings = (state) => fromModals.getShowSettings(state.modals);
export const getShowError = (state) => fromModals.getShowError(state.modals);
export const getErrorMessage = (state) => fromModals.getErrorMessage(state.modals);
