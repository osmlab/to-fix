const stats = (state = {}, action) => {
  switch(action.type) {
    case 'tasks/SELECT_TASK':
      return {};
    case 'stats/FETCH_STATS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case 'stats/FETCH_STATS_SUCCESS':
      return {
        ...action.params,
        ...action.response,
        isFetching: false,
        error: null,
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
export const getFrom = (state) => state.from;
export const getTo = (state) => state.to;
export const getByUser = (state) => state.statsUsers;
export const getByDate = (state) => state.statsDate;
