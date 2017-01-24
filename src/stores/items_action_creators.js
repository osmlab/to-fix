import { server } from '../services';
import schemas from './schemas';
import { asyncAction } from './async_action';
import ItemsConstants from '../constants/items_constants';

const ItemsActionCreators = {
  fetchRandomItem: asyncAction({
    type: ItemsConstants.ITEMS_FETCH_RANDOM,
    asyncCall: server.fetchRandomItem,
    responseSchema: schemas.item,
    showLoader: true,
  }),

  updateItem: asyncAction({
    type: ItemsConstants.ITEMS_UPDATE,
    asyncCall: server.updateItem,
    showLoader: true,
  }),
};

export default ItemsActionCreators;
