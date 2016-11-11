const UserSelectors = {
  getIsAuthenticated: (state) => state.isAuthenticated,
  getOsmId: (state) => state.osmid,
  getUsername: (state) => state.username,
  getAvatar: (state) => state.avatar,
};

export default UserSelectors;
