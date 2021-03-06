import { createSelector } from 'reselect';
import d3 from 'd3';

const tasksSelector = state => state.tasks;

const getAllTasks = state => (
  // Sort by most recent
  state.allIds.map(id => state.byId[id])
    .sort((a, b) => b.value.updated - a.value.updated)
);

const getLatestTaskId = state => {
  if (state.allIds.length !== 0) {
    return getAllTasks(state)[0].idtask;
  }
}

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

const getCurrentTaskSummary = state => (
  getCurrentTask(state).value.stats
);

const getCurrentTaskExtent = state => {
  const taskSummary = getCurrentTaskSummary(state);
  const createdAt = taskSummary.date * 1000;

  const dateFormat = d3.time.format('%Y-%m-%d');
  const fromDate = dateFormat(new Date(createdAt));
  const toDate = dateFormat(new Date());

  return { fromDate, toDate };
};

const getCurrentTaskType = state => (
  getCurrentTaskSummary(state).type
);

const TasksSelectors = {
  getAllTasks: createSelector(tasksSelector, getAllTasks),
  getLatestTaskId: createSelector(tasksSelector, getLatestTaskId),
  getCompletedTasks: createSelector(tasksSelector, getCompletedTasks),
  getActiveTasks: createSelector(tasksSelector, getActiveTasks),
  getCurrentTask: createSelector(tasksSelector, getCurrentTask),
  getCurrentTaskId: createSelector(tasksSelector, getCurrentTaskId),
  getCurrentTaskType: createSelector(tasksSelector, getCurrentTaskType),
  getCurrentTaskSummary: createSelector(tasksSelector, getCurrentTaskSummary),
  getCurrentTaskExtent: createSelector(tasksSelector, getCurrentTaskExtent),
};

export default TasksSelectors;
