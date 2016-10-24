import { combineReducers } from 'redux';

import user from './user';
import settings from './settings';

export default combineReducers({
  user,
  settings,
});
