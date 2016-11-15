import api from '../api';
import { asyncAction } from './async_action';
import ActivityConstants from '../constants/activity_constants';

const ActivityActionCreators = {
  fetchAllActivity: asyncAction({
    type: ActivityConstants.ACTIVITY_FETCH_ALL,
    asyncCall: api.tofix.fetchAllActivity,
    showLoader: true,
  }),

  fetchUserActivity: asyncAction({
    type: ActivityConstants.ACTIVITY_FETCH_FOR_USER,
    asyncCall: api.tofix.fetchUserActivity,
    showLoader: true,
  }),
};

export default ActivityActionCreators;
