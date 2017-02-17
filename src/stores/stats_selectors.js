import { createSelector } from 'reselect';
import pick from 'lodash.pick';
import omit from 'lodash.omit';

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

const getUserStats = (statsByDate) => {
  const actions = ['edit', 'skip', 'fixed', 'noterror'];
  const perDay = statsByDate.map(stat => omit(stat, [ 'start', ...actions ]));
  const statsByUser = [];

  perDay.forEach(stat => {
    Object.keys(stat).forEach(user => {
      const currStats = pick(stat[user], ...actions);
      const prevStats = statsByUser.find(s => s.user == user);
      if (prevStats) {
        actions.forEach(action => prevStats[action] += currStats[action]);
      } else {
        statsByUser.push({ user, ...currStats });
      }
    });
  });

  return statsByUser;
};

const StatsSelectors = {
  getByUser: createSelector(statsSelector, (state) => sortByUserTotal(getUserStats(state.byDate))),
  getByDate: createSelector(statsSelector, (state) => state.byDate),
  getFromDate: createSelector(statsSelector, (state) => state.fromDate),
  getToDate: createSelector(statsSelector, (state) => state.toDate),
  getUpdatedOn: createSelector(statsSelector, (state) => state.updatedOn),
};

export default StatsSelectors;
