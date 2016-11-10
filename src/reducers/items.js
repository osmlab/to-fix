const initialState = {
  isFetching: false,
  error: null,
  item: {},
  itemId: null,
};

const items = (state = initialState, action) => {
  switch(action.type) {
    case 'tasks/SET_TASK_ID':
      // Reset state when a new task is selected
      return initialState;

    case 'items/FETCH_RANDOM_ITEM_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case 'items/FETCH_RANDOM_ITEM_SUCCESS':
      const { entities: { items }, result } = action.response;
      return {
        item: items[result],
        itemId: result,
        isFetching: false,
        error: null
      };
    case 'items/FETCH_RANDOM_ITEM_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    default:
      return state;
  }
};

export default items;

// Selectors
export const getIsFetching = (state) => state.isFetching;
export const getError = (state) => state.error;
export const getCurrentItem = (state) => state.item;
export const getCurrentItemId = (state) => state.itemId;
