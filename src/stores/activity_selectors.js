import { createSelector } from 'reselect';

const activitySelector = state => state.activity;

const ActivitySelectors = {
  getData: createSelector(activitySelector, state => state.data.sort((a, b) => b.time - a.time)),
  getFromDate: createSelector(activitySelector, state => state.fromDate),
  getToDate: createSelector(activitySelector, state => state.toDate),
  getUpdatedOn: createSelector(activitySelector, state => state.updatedOn),
};

export default ActivitySelectors;
