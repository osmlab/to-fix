const activity = (state = {}, action) => {
  switch(action.type) {
    case 'tasks/SELECT_TASK':
      return {};
    case 'activity/FETCH_ACTIVIY_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case 'activity/FETCH_ACTIVITY_SUCCESS':
      return {
        ...action.params,
        ...action.response,
        isFetching: false,
        error: null,
      };
    case 'activity/FETCH_ACTIVITY_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error,
      }
    default:
      return state;
  }
};

export default activity;

export const getData = (state) => state.data;
