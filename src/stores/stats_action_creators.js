import api from '../api';
import { asyncAction } from './async_action';
import StatsConstants from '../constants/stats_constants';

const StatsActionCreators = {
  fetchAllStats: asyncAction({
    type: StatsConstants.STATS_FETCH_ALL,
    asyncCall: api.tofix.fetchAllStats,
    showLoader: true,
  }),
};

export default StatsActionCreators;
