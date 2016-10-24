import { combineReducers } from 'redux';

import user from './user';
import settings from './settings';
import tasks from './tasks';

export default combineReducers({
  user,
  settings,
  tasks,
});
