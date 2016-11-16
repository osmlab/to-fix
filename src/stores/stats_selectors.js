import { createSelector } from 'reselect';

const statsSelector = state => state.stats;

const countUserTotal = (statsByUser) => {
  return statsByUser.map(stats => {
    const { edit, fixed, skip, noterror } = stats;
    stats.total = edit + fixed + skip + noterror;
    return stats;
  });
};

const sortByUserTotal = (statsByUser) => {
  return countUserTotal(statsByUser)
    .sort((a, b) => b.total - a.total);
};

const StatsSelectors = {
  getByUser: createSelector(statsSelector, (state) => sortByUserTotal(state.byUser)),
  getByDate: createSelector(statsSelector, (state) => state.byDate),
  getFromDate: createSelector(statsSelector, (state) => state.fromDate),
  getToDate: createSelector(statsSelector, (state) => state.toDate),
  getUpdatedOn: createSelector(statsSelector, (state) => state.updatedOn),
};

export default StatsSelectors;
