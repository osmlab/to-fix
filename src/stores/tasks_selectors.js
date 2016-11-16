import { createSelector } from 'reselect';
import d3 from 'd3';

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

const getTaskExtent = state => {
  const taskSummary = getTaskSummary(state);
  const createdAt = taskSummary.date * 1000;

  const dateFormat = d3.time.format('%Y-%m-%d');
  const fromDate = dateFormat(new Date(createdAt));
  const toDate = dateFormat(new Date());

  return { fromDate, toDate };
};

const TasksSelectors = {
  getAllTasks: createSelector(tasksSelector, getAllTasks),
  getCompletedTasks: createSelector(tasksSelector, getCompletedTasks),
  getActiveTasks: createSelector(tasksSelector, getActiveTasks),
  getCurrentTask: createSelector(tasksSelector, getCurrentTask),
  getCurrentTaskId: createSelector(tasksSelector, getCurrentTaskId),
  getTaskSummary: createSelector(tasksSelector, getTaskSummary),
  getTaskExtent: createSelector(tasksSelector, getTaskExtent),
};

export default TasksSelectors;
