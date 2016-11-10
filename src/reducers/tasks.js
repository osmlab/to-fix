import { combineReducers } from 'redux';
import union from 'lodash.union';

const byId = (state = {}, action) => {
  switch(action.type) {
    case 'tasks/FETCH_ALL_TASKS_SUCCESS':
    case 'tasks/CREATE_TASK_SUCCESS':
    case 'tasks/UPDATE_TASK_SUCCESS':
      return {
        ...state,
        ...action.response.entities.tasks,
      };
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch(action.type) {
    case 'tasks/FETCH_ALL_TASKS_SUCCESS':
      return union(state, action.response.result.tasks);
    case 'tasks/CREATE_TASK_SUCCESS':
    case 'tasks/UPDATE_TASK_SUCCESS':
      return union(state, [action.response.result]);
    default:
      return state;
  }
};

const currentId = (state = null, action) => {
  switch(action.type) {
    case 'tasks/SET_TASK_ID':
      return action.idtask;
    default:
      return state;
  }
};

const isTasksAction = /^tasks/;

const isRequest = /_REQUEST$/;
const isSuccess = /_SUCCESS$/;
const isFailure = /_FAILURE$/;

const isFetching = (state = false, action) => {
  if (!isTasksAction.test(action.type)) return state;

  if (isRequest.test(action.type)) return true;
  if (isSuccess.test(action.type)) return false;
  if (isFailure.test(action.type)) return false;

  return state;
};

const error = (state = null, action) => {
  if (!isTasksAction.test(action.type)) return state;

  if (isRequest.test(action.type)) return null;
  if (isSuccess.test(action.type)) return null;
  if (isFailure.test(action.type)) return action.error;

  return state;
};

export default combineReducers({
  byId,
  allIds,
  currentId,
  isFetching,
  error,
});

// Selectors
export const getIsFetching = (state) =>
  state.isFetching;

export const getError = (state) =>
  state.error;

export const getAllTasks = (state) =>
  // Sort by most recent
  state.allIds.map(id => state.byId[id])
    .sort((a, b) => b.value.updated - a.value.updated);

export const getCompletedTasks = (state) =>
  getTasks(state)
    .filter(task => task.isCompleted);

export const getActiveTasks = (state) =>
  getTasks(state)
    .filter(task => !task.isCompleted);

export const getCurrentTask = (state) =>
  state.byId[state.currentId];

export const getTaskSummary = (state) =>
  getCurrentTask(state).value.stats;
