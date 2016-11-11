import * as api from '../api';
import { asyncAction } from './async';
import StatsConstants from '../constants/stats_constants';

export const fetchAllStats = asyncAction({
  type: StatsConstants.STATS_FETCH_ALL,
  asyncCall: api.tofix.fetchAllStats,
});
