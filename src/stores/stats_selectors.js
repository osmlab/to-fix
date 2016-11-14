import { createSelector } from 'reselect';

const statsSelector = state => state.stats;

const StatsSelectors = {
  getByUser: createSelector(statsSelector, (state) => state.byUser),
  getByDate: createSelector(statsSelector, (state) => state.byDate),
  getFromDate: createSelector(statsSelector, (state) => state.fromDate),
  getToDate: createSelector(statsSelector, (state) => state.toDate),
  getUpdatedOn: createSelector(statsSelector, (state) => state.updatedOn),
};

export default StatsSelectors;
