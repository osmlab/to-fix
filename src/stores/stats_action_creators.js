import { server } from '../services';
import { asyncAction } from './async_action';
import StatsConstants from '../constants/stats_constants';

const StatsActionCreators = {
  fetchAllStats: asyncAction({
    type: StatsConstants.STATS_FETCH_ALL,
    asyncCall: server.fetchAllStats,
    showLoader: true,
  }),
};

export default StatsActionCreators;
