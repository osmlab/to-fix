import { combineReducers } from 'redux';

import user, * as fromUser from './user';
import settings, * as fromSettings from './settings';
import tasks, * as fromTasks from './tasks';
import items from './items';
import activity, * as fromActivity from './activity';
import stats from './stats';

export default combineReducers({
  user,
  settings,
  tasks,
  items,
  activity,
  stats,
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

// Activity state
export const getActivityData = (state) => fromActivity.getActivityData(state.activity);
