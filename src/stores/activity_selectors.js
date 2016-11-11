const ActivitySelectors = {
  getData: (state) => state.data.sort((a, b) => b.time - a.time),
  getFromDate: (state) => state.fromDate,
  getToDate: (state) => state.toDate,
  getUpdatedOn: (state) => state.updatedOn,
};

export default ActivitySelectors;
