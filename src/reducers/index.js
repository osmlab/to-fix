import { combineReducers } from 'redux';

import user from './user';
import settings from './settings';
import tasks from './tasks';
import items from './items';
import activity from './activity';
import stats from './stats';

export default combineReducers({
  user,
  settings,
  tasks,
  items,
  activity,
  stats,
});
