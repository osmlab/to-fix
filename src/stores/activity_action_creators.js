import * as api from '../api';
import { asyncAction } from './async';
import ActivityConstants from '../constants/activity_constants';

export const fetchAllActivity = asyncAction({
  type: ActivityConstants.ACTIVITY_FETCH_ALL,
  asyncCall: api.tofix.fetchAllActivity,
});

export const fetchUserActivity = asyncAction({
  type: ActivityConstants.ACTIVITY_FETCH_FOR_USER,
  asyncCall: api.tofix.fetchUserActivity,
});
