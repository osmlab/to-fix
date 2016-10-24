import api from '../api';
import * as schema from './schema';
import { normalize } from 'normalizr';

const asyncAction = ({ type, asyncCall, responseSchema }) => {
  return (params) => (dispatch) => {
    dispatch({
      type: `${type}_REQUEST`,
      ...params,
    });

    return asyncCall(params).then(
      response => dispatch({
        type: `${type}_SUCCESS`,
        response: responseSchema ? normalize(response, responseSchema) : response,
        params: params || {},
      }),
      error => dispatch({
        type: `${type}_FAILURE`,
        error,
      })
    );
  };
};

// Tasks
export const fetchAllTasks = asyncAction({
  type: 'FETCH_ALL_TASKS',
  asyncCall: api.tofix.fetchAllTasks,
  responseSchema: { tasks: schema.arrayOfTasks },
});

export const fetchTaskById = asyncAction({
  type: 'FETCH_TASK_BY_ID',
  asyncCall: api.tofix.fetchTaskById,
  responseSchema: schema.task,
});

export const createTask = asyncAction({
  type: 'CREATE_TASK',
  asyncCall: api.tofix.createTask,
  responseSchema: schema.task,
});

export const updateTask = asyncAction({
  type: 'UPDATE_TASK',
  asyncCall: api.tofix.updateTask,
  responseSchema: schema.task,
});

export const deleteTask = asyncAction({
  type: 'DELETE_TASK',
  asyncCall: api.tofix.deleteTask,
});

// Items
export const fetchAllItems = asyncAction({
  type: 'FETCH_ALL_ITEMS',
  asyncCall: api.tofix.fetchAllItems,
  responseSchema: schema.arrayOfItems,
});

export const fetchRandomItem = asyncAction({
  type: 'FETCH_RANDOM_ITEM',
  asyncCall: api.tofix.fetchRandomItem,
  responseSchema: schema.item,
});

export const fetchItemByKey = asyncAction({
  type: 'FETCH_ITEM_BY_KEY',
  asyncCall: api.tofix.fetchItemByKey,
  responseSchema: schema.item,
});

export const fetchNItems = asyncAction({
  type: 'FETCH_N_ITEMS',
  asyncCall: api.tofix.fetchNItems,
  responseSchema: schema.arrayOfItems,
});

export const updateItem = asyncAction({
  type: 'UPDATE_ITEM',
  asyncCall: api.tofix.updateItem,
});

export const unlockItems = asyncAction({
  type: 'UNLOCK_ITEMS',
  asyncCall: api.tofix.unlockItems,
});

// Activity
export const fetchActivity = asyncAction({
  type: 'FETCH_ACTIVITY',
  asyncCall: api.tofix.fetchActivity,
});

export const fetchUserActivity = asyncAction({
  type: 'FETCH_USER_ACTIVITY',
  asyncCall: api.tofix.fetchUserActivity,
});

// Stats
export const fetchStats = asyncAction({
  type: 'FETCH_STATS',
  asyncCall: api.tofix.fetchStats,
});

// User
export const userLogin = asyncAction({
  type: 'USER_LOGIN',
  asyncCall: api.osm.login,
});

export const getUserDetails = asyncAction({
  type: 'GET_USER_DETAILS',
  asyncCall: api.osm.getUserDetails,
});

export const userLogout = () => (dispatch) => {
  api.osm.logout();
  dispatch({ type: 'USER_LOGOUT' });
};

// Settings
export const toggleSidebar = () => ({
  type: 'TOGGLE_SIDEBAR',
});

export const setEditorPreference = (editor) => ({
  type: 'SET_EDITOR_PREFERENCE',
  editor,
});
