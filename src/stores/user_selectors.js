import { createSelector } from 'reselect';

const userSelector = state => state.user;

const UserSelectors = {
  getIsAuthenticated: createSelector(userSelector, (state) => state.isAuthenticated),
  getOsmId: createSelector(userSelector, (state) => state.osmid),
  getUsername: createSelector(userSelector, (state) => state.username),
  getAvatar: createSelector(userSelector, (state) => state.avatar),
  getRole: createSelector(userSelector, (state) => state.role),
  getToken: createSelector(userSelector, (state) => state.token),
};

export default UserSelectors;
