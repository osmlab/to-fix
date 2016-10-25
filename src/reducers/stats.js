const stats = (state = {}, action) => {
  switch(action.type) {
    case 'tasks/SELECT_TASK':
      return {};
    case 'stats/FETCH_STATS_SUCCESS':
      return {
        ...action.params,
        ...action.response,
      };
    default:
      return state;
  }
};

export default stats;
