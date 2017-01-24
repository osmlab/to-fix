import { server } from '../services';
import { asyncAction } from './async_action';
import ActivityConstants from '../constants/activity_constants';

const ActivityActionCreators = {
  fetchRecentActivity: asyncAction({
    type: ActivityConstants.ACTIVITY_FETCH_RECENT,
    asyncCall: server.fetchRecentActivity,
    showLoader: true,
  }),
};

export default ActivityActionCreators;
