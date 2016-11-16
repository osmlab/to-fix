import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import api from '../api';
import safeStorage from '../utils/safe_storage';

import user from './user_reducer';
import settings from './settings_reducer';
import tasks from './tasks_reducer';
import items from './items_reducer';
import activity from './activity_reducer';
import stats from './stats_reducer';
import modals from './modals_reducer';
import loading from './loading_reducer';

// Root reducer
const rootReducer = combineReducers({
  user,
  settings,
  tasks,
  items,
  activity,
  stats,
  modals,
  loading,
});

// Middlewares
const middlewares = [thunk];

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger();
  middlewares.push(logger);
}

// Persisted state
const persistedState = {
  user: {
    isAuthenticated: api.osm.isAuthenticated(),
  },
  settings: {
    sidebar: safeStorage.get('sidebar') || true,
    editor: safeStorage.get('editor') || 'id',
  },
};

// Store
const store = createStore(
  rootReducer,
  persistedState,
  applyMiddleware(...middlewares)
);

// Persist change in settings to local storage
store.subscribe(() => {
  const state = store.getState();
  const { sidebar, editor } = state.settings;

  if (sidebar !== safeStorage.get('sidebar')) {
    safeStorage.set('sidebar', sidebar);
  }

  if (editor !== safeStorage.get('editor')) {
    safeStorage.set('editor', editor);
  }
});

export default store;
