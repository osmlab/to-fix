import { combineReducers } from 'redux';
import union from 'lodash/union';

const isTasksAction = /^tasks/;

const isRequest = /_REQUEST$/;
const isSuccess = /_SUCCESS$/;
const isFailure = /_FAILURE$/;

const byId = (state = {}, action) => {
  if (!isTasksAction.test(action.type)) return state;
  if (!isSuccess.test(action.type)) return state;

  switch(action.type) {
    case 'tasks/FETCH_ALL_TASKS_SUCCESS':
    case 'tasks/FETCH_TASK_BY_ID_SUCCESS':
    case 'tasks/CREATE_TASK_SUCCESS':
    case 'tasks/UPDATE_TASK_SUCCESS':
      return {
        ...state,
        ...action.response.entities.tasks,
      };
    case 'tasks/DELETE_TASK_SUCCESS':
      return {
        ...state,
        [action.params.idtask]: undefined,
      };
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  if (!isTasksAction.test(action.type)) return state;
  if (!isSuccess.test(action.type)) return state;

  switch(action.type) {
    case 'tasks/FETCH_ALL_TASKS_SUCCESS':
      return union(state, action.response.result.tasks);
    case 'tasks/FETCH_TASK_BY_ID_SUCCESS':
    case 'tasks/CREATE_TASK_SUCCESS':
    case 'tasks/UPDATE_TASK_SUCCESS':
      return union(state, [action.response.result]);
    case 'tasks/DELETE_TASK_SUCCESS':
      return state.filter(id => id !== action.params.idtask);
    default:
      return state;
  }
};

const currentId = (state = null, action) => {
  if (!isTasksAction.test(action.type)) return state;

  switch(action.type) {
    case 'tasks/SELECT_TASK':
      return action.idtask;
    default:
      return state;
  }
};

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
export const getTasks = (state) => state.allIds.map(id => state.byId[id]);
export const getIsFetching = (state) => state.isFetching;
export const getError = (state) => state.error;
export const getCompletedTasks = (state) => getTasks(state).filter(task => task.isCompleted);
export const getActiveTasks = (state) => getTasks(state).filter(task => !task.isCompleted);
export const getCurrentTask = (state) => state.byId[state.currentId];
