import ActivityConstants from '../constants/activity_constants';
import TasksConstants from '../constants/tasks_constants';
import { AsyncStatus } from './async_action';

const initialState = {
  data: [],
  fromDate: '',
  toDate: '',
  updatedOn: null,
};

const activity = (state = initialState, action) => {
  // Reset state when a new task is selected
  if (action.type === TasksConstants.TASKS_SELECT) {
    return initialState;
  }

  switch(action.type) {
    case ActivityConstants.ACTIVITY_FETCH_RECENT:
      if (action.status === AsyncStatus.SUCCESS) {
        const { data, updated } = action.response;
        const { from, to } = action.params;
        return {
          data,
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

export default activity;
