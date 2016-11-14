import { createSelector } from 'reselect';

const tasksSelector = state => state.tasks;

const getAllTasks = state => (
  // Sort by most recent
  state.allIds.map(id => state.byId[id])
    .sort((a, b) => b.value.updated - a.value.updated)
);

const getCompletedTasks = state => (
  getAllTasks(state)
    .filter(task => task.isCompleted)
);

const getActiveTasks = state => (
  getAllTasks(state)
    .filter(task => !task.isCompleted)
);

const getCurrentTask = state => (
  state.byId[state.currentId]
);

const getCurrentTaskId = state => (
  state.currentId
);

const getTaskSummary = state => (
  getCurrentTask(state).value.stats
);

const TasksSelectors = {
  getAllTasks: createSelector(tasksSelector, getAllTasks),
  getCompletedTasks: createSelector(tasksSelector, getCompletedTasks),
  getActiveTasks: createSelector(tasksSelector, getActiveTasks),
  getCurrentTask: createSelector(tasksSelector, getCurrentTask),
  getCurrentTaskId: createSelector(tasksSelector, getCurrentTaskId),
  getTaskSummary: createSelector(tasksSelector, getTaskSummary),
};

export default TasksSelectors;
