import * as api from '../api';
import * as schema from './schema';
import { asyncAction } from './async';
import ItemsConstants from '../constants/items_constants';

export const fetchAllItems = asyncAction({
  type: ItemsConstants.ITEMS_FETCH_ALL,
  asyncCall: api.tofix.fetchAllItems,
  responseSchema: schema.arrayOfItems,
});

export const fetchItemByKey = asyncAction({
  type: ItemsConstants.ITEMS_FETCH_BY_KEY,
  asyncCall: api.tofix.fetchItemByKey,
  responseSchema: schema.item,
});

export const fetchRandomItem = asyncAction({
  type: ItemsConstants.ITEMS_FETCH_RANDOM,
  asyncCall: api.tofix.fetchRandomItem,
  responseSchema: schema.item,
});

export const fetchNItems = asyncAction({
  type: ItemsConstants.ITEMS_FETCH_N,
  asyncCall: api.tofix.fetchNItems,
  responseSchema: schema.arrayOfItems,
});

export const updateItem = asyncAction({
  type: ItemsConstants.ITEMS_UPDATE,
  asyncCall: api.tofix.updateItem,
});

export const unlockItems = asyncAction({
  type: ItemsConstants.ITEMS_UNLOCK,
  asyncCall: api.tofix.unlockItems,
});
