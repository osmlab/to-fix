import fromUser from './user_selectors';
import fromSettings from './settings_selectors';
import fromTasks from './tasks_selectors';
import fromItems from './items_selectors';
import fromActivity from './activity_selectors';
import fromStats from './stats_selectors';
import fromModals from './modals_selectors';

export const UserSelectors = {
  getIsAuthenticated: (state) => fromUser.isAuthenticated(state.user),
  getOsmId: (state) => fromUser.osmid(state.user),
  getUsername: (state) => fromUser.username(state.user),
  getAvatar: (state) => fromUser.avatar(state.user),
};

export const SettingsSelectors = {
  getSidebarSetting: (state) => fromSettings.sidebar(state.settings),
  getEditorSetting: (state) => fromSettings.editor(state.settings),
};

export const TasksSelectors = {
  getAllTasks: (state) => fromTasks.getAllTasks(state.tasks),
  getCompletedTasks: (state) => fromTasks.getCompletedTasks(state.tasks),
  getActiveTasks: (state) => fromTasks.getActiveTasks(state.tasks),
  getCurrentTask: (state) => fromTasks.getCurrentTask(state.tasks),
  getTaskSummary: (state) => fromTasks.getTaskSummary(state.tasks),
};

export const ItemsSelectors = {
  getCurrentItem: (state) => fromItems.getCurrentItem(state.items),
  getCurrentItemId: (state) => fromItems.getCurrentItemId(state.items),
};

export const ActivitySelectors = {
  getActivityData: (state) => fromActivity.getData(state.activity),
  getActivityFromDate: (state) => fromActivity.getFromDate(state.activity),
  getActivityToDate: (state) => fromActivity.getToDate(state.activity),
  getActivityUpdatedOn: (state) => fromActivity.getUpdatedOn(state.activity),
};

export const StatsSelectors = {
  getStatsByUser: (state) => fromStats.getByUser(state.stats),
  getStatsByDate: (state) => fromStats.getByDate(state.stats),
  getStatsFromDate: (state) => fromStats.getFromDate(state.stats),
  getStatsToDate: (state) => fromStats.getToDate(state.stats),
  getStatsUpdatedOn: (state) => fromStats.getUpdatedOn(state.stats),
};

export const ModalsSelectors = {
  getShowSettings: (state) => fromModals.showSettings(stats.modals),
  getShowError: (state) => fromModals.getShowError(stats.modals),
  getErrorMessage: (state) => fromModals.getErrorMessage(stats.modals),
};
