const initialState = {
  isFetching: false,
  error: null,
  data: [],
  from: null,
  to: null,
  updated: null,
};

const activity = (state = initialState, action) => {
  switch(action.type) {
    case 'tasks/SET_TASK_ID':
      // Reset state when a new task is selected
      return initialState;

    case 'activity/FETCH_ACTIVIY_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case 'activity/FETCH_ACTIVITY_SUCCESS':
      const { data, updated } = action.response;
      const { from, to } = action.params;
      return {
        data,
        from,
        to,
        updated,
        isFetching: false,
        error: null,
      };
    case 'activity/FETCH_ACTIVITY_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    default:
      return state;
  }
};

export default activity;

// Selectors
export const getIsFetching = (state) => state.isFetching;
export const getError = (state) => state.error;
export const getData = (state) => state.data.sort((a, b) => b.time - a.time);
export const getFrom = (state) => state.from;
export const getTo = (state) => state.to;
export const getUpdated = (state) => state.updated;
