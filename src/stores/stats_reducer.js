import StatsConstants from '../constants/stats_constants';
import TasksConstants from '../constants/tasks_constants';
import { AsyncStatus } from './async_action';

const initialState = {
  byDate: [],
  fromDate: '',
  toDate: '',
  updatedOn: null,
};

const stats = (state = initialState, action) => {
  // Reset state when a new task is selected
  if (action.type === TasksConstants.TASKS_SELECT) {
    return initialState;
  }

  switch(action.type) {
    case StatsConstants.STATS_FETCH_ALL:
      if (action.status === AsyncStatus.SUCCESS) {
        const { statsDate, updated } = action.response;
        const { from, to } = action.params;
        return {
          byDate: statsDate,
          fromDate: from,
          toDate: to,
          updatedOn: updated,
        };
      }
      return state;
    default:
      return state;
  }
};

export default stats;
