import api from '../api';
import * as schema from './schema';
import { normalize } from 'normalizr';
import * as store from '../util/localStorage';

const asyncAction = ({ type, asyncCall, responseSchema }) => {
  return (params = {}) => (dispatch) => {
    dispatch({
      type: `${type}_REQUEST`,
      ...params,
    });

    return asyncCall(params).then(
      response => dispatch({
        type: `${type}_SUCCESS`,
        response: responseSchema ? normalize(response, responseSchema) : response,
        params,
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
  type: 'tasks/FETCH_ALL_TASKS',
  asyncCall: api.tofix.fetchAllTasks,
  responseSchema: { tasks: schema.arrayOfTasks },
});

export const fetchTaskById = asyncAction({
  type: 'tasks/FETCH_TASK_BY_ID',
  asyncCall: api.tofix.fetchTaskById,
  responseSchema: schema.task,
});

export const createTask = asyncAction({
  type: 'tasks/CREATE_TASK',
  asyncCall: api.tofix.createTask,
  responseSchema: schema.task,
});

export const updateTask = asyncAction({
  type: 'tasks/UPDATE_TASK',
  asyncCall: api.tofix.updateTask,
  responseSchema: schema.task,
});

export const deleteTask = asyncAction({
  type: 'tasks/DELETE_TASK',
  asyncCall: api.tofix.deleteTask,
});

export const selectTask = ({ idtask }) => (dispatch) => {
  dispatch({ type: 'tasks/SELECT_TASK', idtask });
};

// Items
export const fetchAllItems = asyncAction({
  type: 'items/FETCH_ALL_ITEMS',
  asyncCall: api.tofix.fetchAllItems,
  responseSchema: schema.arrayOfItems,
});

export const fetchRandomItem = asyncAction({
  type: 'items/FETCH_RANDOM_ITEM',
  asyncCall: api.tofix.fetchRandomItem,
  responseSchema: schema.item,
});

export const fetchItemByKey = asyncAction({
  type: 'items/FETCH_ITEM_BY_KEY',
  asyncCall: api.tofix.fetchItemByKey,
  responseSchema: schema.item,
});

export const fetchNItems = asyncAction({
  type: 'items/FETCH_N_ITEMS',
  asyncCall: api.tofix.fetchNItems,
  responseSchema: schema.arrayOfItems,
});

export const updateItem = asyncAction({
  type: 'items/UPDATE_ITEM',
  asyncCall: api.tofix.updateItem,
});

export const unlockItems = asyncAction({
  type: 'items/UNLOCK_ITEMS',
  asyncCall: api.tofix.unlockItems,
});

// Activity
export const fetchActivity = asyncAction({
  type: 'activity/FETCH_ACTIVITY',
  asyncCall: api.tofix.fetchActivity,
});

export const fetchUserActivity = asyncAction({
  type: 'activity/FETCH_USER_ACTIVITY',
  asyncCall: api.tofix.fetchUserActivity,
});

// Stats
export const fetchStats = asyncAction({
  type: 'stats/FETCH_STATS',
  asyncCall: api.tofix.fetchStats,
});

// User
export const userLogin = asyncAction({
  type: 'user/USER_LOGIN',
  asyncCall: api.osm.login,
});

export const getUserDetails = asyncAction({
  type: 'user/GET_USER_DETAILS',
  asyncCall: api.osm.getUserDetails,
});

export const userLogout = () => (dispatch) => {
  api.osm.logout();
  dispatch({ type: 'user/USER_LOGOUT' });
};

// Settings
export const toggleSidebar = () => {
  store.set('sidebar', !store.get('sidebar'));
  return {
    type: 'settings/TOGGLE_SIDEBAR',
  };
}

export const setEditorPreference = (editor) => {
  store.set('editor', editor);
  return {
    type: 'settings/SET_EDITOR_PREFERENCE',
    editor,
  };
}

// Geocoder
export const reverseGeocode = asyncAction({
  type: 'geocoder/REVERSE_GEOCODE',
  asyncCall: api.geocoder.reverseGeocode,
});

// Modals
export const openSettings = () => ({
  type: 'modals/OPEN_SETTINGS',
});

export const closeSettings = () => ({
  type: 'modals/CLOSE_SETTINGS',
});

export const openError = (error) => ({
  type: 'modals/OPEN_ERROR',
  error,
});

export const closeError = () => ({
  type: 'modals/CLOSE_ERROR',
});
