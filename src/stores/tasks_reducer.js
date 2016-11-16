import { combineReducers } from 'redux';
import union from 'lodash.union';

import TasksConstants from '../constants/tasks_constants';
import { AsyncStatus } from './async_action';

const byId = (state = {}, action) => {
  switch(action.type) {
    case TasksConstants.TASKS_FETCH_ALL:
    case TasksConstants.TASKS_CREATE:
    case TasksConstants.TASKS_UPDATE:
      if (action.status === AsyncStatus.SUCCESS) {
        return {
          ...state,
          ...action.response.entities.tasks,
        };
      }
      return state;
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch(action.type) {
    case TasksConstants.TASKS_FETCH_ALL:
      if (action.status === AsyncStatus.SUCCESS) {
        return union(state, action.response.result.tasks);
      }
      return state;
    case TasksConstants.TASKS_CREATE:
    case TasksConstants.TASKS_UPDATE:
      if (action.status === AsyncStatus.SUCCESS) {
        return union(state, [action.response.result]);
      }
      return state;
    default:
      return state;
  }
};

const currentId = (state = null, action) => {
  switch(action.type) {
    case TasksConstants.TASKS_SELECT:
      return action.idtask;
    default:
      return state;
  }
};

export default combineReducers({
  byId,
  allIds,
  currentId,
});
