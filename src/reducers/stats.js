const initialState = {
  isFetching: false,
  error: null,
  byUser: [],
  byDate: [],
  from: null,
  to: null,
  updated: null,
};

const stats = (state = initialState, action) => {
  switch(action.type) {
    case 'tasks/SET_TASK_ID':
      // Reset state when a new task is selected
      return initialState;

    case 'stats/FETCH_STATS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case 'stats/FETCH_STATS_SUCCESS':
      const { statsUsers, statsDate, updated } = action.response;
      const { from, to } = action.params;
      return {
        isFetching: false,
        error: null,
        from,
        to,
        byUser: statsUsers,
        byDate: statsDate,
        updated,
      };
    case 'stats/FETCH_STATS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    default:
      return state;
  }
};

export default stats;

// Selectors
export const getIsFetching = (state) => state.isFetching;
export const getError = (state) => state.error;
export const getByUser = (state) => state.byUser;
export const getByDate = (state) => state.byDate;
export const getFrom = (state) => state.from;
export const getTo = (state) => state.to;
export const getUpdated = (state) => state.updated;
