import api from '../api';

const initialState = {
  isAuthenticated: api.osm.isAuthenticated(),
};

const user = (state = initialState, action) => {
  switch(action.type) {
    case 'user/LOGIN_SUCCESS':
      return {
        isAuthenticated: true,
      };
    case 'user/LOGIN_FAILURE':
      return {
        isAuthenticated: false,
        error: action.error,
      }
    case 'user/GET_USER_DETAILS_SUCCESS':
      return {
        isAuthenticated: true,
        ...action.response,
      };
    case 'user/GET_USER_DETAILS_FAILURE':
      return {
        isAuthenticated: false,
        error: action.error,
      };
    case 'user/LOGOUT':
      return {
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default user;

// Selectors
export const getIsAuthenticated = (state) => state.isAuthenticated;
export const getOsmId = (state) => state.osmid;
export const getUsername = (state) => state.username;
export const getAvatar = (state) => state.avatar;
