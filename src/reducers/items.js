import { combineReducers } from 'redux';
import union from 'lodash/union';

const isItemsAction = /^items/;

const isRequest = /_REQUEST$/;
const isSuccess = /_SUCCESS$/;
const isFailure = /_FAILURE$/;

const byId = (state = {}, action) => {
  if (!isItemsAction.test(action.type)) return state;
  if (!isSuccess.test(action.type)) return state;

  switch(action.type) {
    case 'items/FETCH_ALL_ITEMS_SUCCESS':
    case 'items/FETCH_N_ITEMS_SUCCESS':
      return action.response.entities.items;
    case 'items/FETCH_RANDOM_ITEM_SUCCESS':
    case 'items/FETCH_ITEM_BY_KEY_SUCCESS':
      return {
        ...state,
        ...action.response.entities.items,
      };
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  if (!isItemsAction.test(action.type)) return state;
  if (!isSuccess.test(action.type)) return state;

  switch(action.type) {
    case 'items/FETCH_ALL_ITEMS_SUCCESS':
    case 'items/FETCH_N_ITEMS_SUCCESS':
      return action.response.result;
    case 'items/FETCH_RANDOM_ITEM_SUCCESS':
    case 'items/FETCH_ITEM_BY_KEY_SUCCESS':
      return union(state, [action.response.result]);
    default:
      return state;
  }
};

const currentId = (state = null, action) => {
  if (!isItemsAction.test(action.type)) return state;

  switch(action.type) {
    case 'items/FETCH_RANDOM_ITEM_SUCCESS':
    case 'items/FETCH_ITEM_BY_KEY_SUCCESS':
      return action.response.result;
    default:
      return state;
  }
};

const isFetching = (state = false, action) => {
  if (!isItemsAction.test(action.type)) return state;

  if (isRequest.test(action.type)) return true;
  if (isSuccess.test(action.type)) return false;
  if (isFailure.test(action.type)) return false;

  return state;
};

const error = (state = null, action) => {
  if (!isItemsAction.test(action.type)) return state;

  if (isRequest.test(action.type)) return null;
  if (isSuccess.test(action.type)) return null;
  if (isFailure.test(action.type)) return action.error;

  return state;
};

export default combineReducers({
  byId,
  allIds,
  currentId,
  isFetching,
  error,
});
