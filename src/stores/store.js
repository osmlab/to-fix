import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import user from './user_reducer';
import settings from './settings_reducer';
import tasks from './tasks_reducer';
import items from './items_reducer';
import activity from './activity_reducer';
import stats from './stats_reducer';
import modals from './modals_reducer';

const rootReducer = combineReducers({
  user,
  settings,
  tasks,
  items,
  activity,
  stats,
  modals,
});

const middlewares = [thunk];

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger();
  middlewares.push(logger);
}

const store = createStore(
  rootReducer,
  applyMiddleware(...middlewares)
);

export default store;
