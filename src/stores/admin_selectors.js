import { createSelector } from 'reselect';

const adminSelector = state => state.admin;

const sortByName = (users) => {
  return users.sort((a, b) => {
    if (a.user.toLowerCase() < b.user.toLowerCase()) return -1;
    if (a.user.toLowerCase() > b.user.toLowerCase()) return  1;
    return 0;
  });
};

const AdminSelectors = {
  getUsers: createSelector(adminSelector, state => sortByName(state.users)),
};

export default AdminSelectors;
