import { combineReducers } from 'redux';

import user from './user';
import settings from './settings';
import tasks from './tasks';
import items from './items';

export default combineReducers({
  user,
  settings,
  tasks,
  items,
});
