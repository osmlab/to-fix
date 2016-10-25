const activity = (state = {}, action) => {
  switch(action.type) {
    case 'tasks/SELECT_TASK':
      return {};
    case 'activity/FETCH_ACTIVITY_SUCCESS':
      return {
        ...action.params,
        ...action.response,
      };
    default:
      return state;
  }
};

export default activity;
