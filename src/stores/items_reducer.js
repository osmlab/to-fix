import ItemsConstants from '../constants/items_constants';
import TasksConstants from '../constants/tasks_constants';
import { AsyncStatus } from './async_action';

const initialState = {
  item: {},
  itemId: null,
};

const items = (state = initialState, action) => {
  // Reset state when a new task is selected
  if (action.type === TasksConstants.TASKS_SELECT) {
    return initialState;
  }

  switch(action.type) {
    case ItemsConstants.ITEMS_FETCH_RANDOM:
      if (action.status === AsyncStatus.SUCCESS) {
        const { entities: { items }, result } = action.response;
        return {
          item: items[result],
          itemId: result,
        };
      }
      return state;
    default:
      return state;
  }
};

export default items;
