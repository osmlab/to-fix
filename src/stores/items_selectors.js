import { createSelector } from 'reselect';

const itemsSelector = state => state.items;

const ItemsSelectors = {
  getCurrentItem: createSelector(itemsSelector, (state) => state.item),
  getCurrentItemId: createSelector(itemsSelector, (state) => state.itemId),
};

export default ItemsSelectors;
