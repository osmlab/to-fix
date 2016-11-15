import api from '../api';
import schemas from './schemas';
import { asyncAction } from './async_action';
import ItemsConstants from '../constants/items_constants';

const ItemsActionCreators = {
  fetchAllItems: asyncAction({
    type: ItemsConstants.ITEMS_FETCH_ALL,
    asyncCall: api.tofix.fetchAllItems,
    responseSchema: schemas.arrayOfItems,
    showLoader: true,
  }),

  fetchItemByKey: asyncAction({
    type: ItemsConstants.ITEMS_FETCH_BY_KEY,
    asyncCall: api.tofix.fetchItemByKey,
    responseSchema: schemas.item,
    showLoader: true,
  }),

  fetchRandomItem: asyncAction({
    type: ItemsConstants.ITEMS_FETCH_RANDOM,
    asyncCall: api.tofix.fetchRandomItem,
    responseSchema: schemas.item,
    showLoader: true,
  }),

  fetchNItems: asyncAction({
    type: ItemsConstants.ITEMS_FETCH_N,
    asyncCall: api.tofix.fetchNItems,
    responseSchema: schemas.arrayOfItems,
    showLoader: true,
  }),

  updateItem: asyncAction({
    type: ItemsConstants.ITEMS_UPDATE,
    asyncCall: api.tofix.updateItem,
    showLoader: true,
  }),

  unlockItems: asyncAction({
    type: ItemsConstants.ITEMS_UNLOCK,
    asyncCall: api.tofix.unlockItems,
    showLoader: true,
  }),
};

export default ItemsActionCreators;
