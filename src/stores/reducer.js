import { combineReducers } from 'redux';

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

export default rootReducer;
