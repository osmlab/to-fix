import * as api from '../api';
import { asyncAction } from './async';
import UserConstants from '../constants/user_constants';

export const login = asyncAction({
  type: UserConstants.USER_LOGIN,
  asyncCall: api.osm.login,
});

export const fetchUserDetails = asyncAction({
  type: UserConstants.USER_FETCH_USER_DETAILS,
  asyncCall: api.osm.getUserDetails,
});

export const logout = () => (dispatch) => {
  api.osm.logout();
  dispatch({ type: UserConstants.USER_LOGOUT });
};
