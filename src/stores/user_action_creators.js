import api from '../api';
import { asyncAction } from './async_action';
import UserConstants from '../constants/user_constants';

const UserActionCreators = {
  login: asyncAction({
    type: UserConstants.USER_LOGIN,
    asyncCall: api.osm.login,
  }),

  fetchUserDetails: asyncAction({
    type: UserConstants.USER_FETCH_USER_DETAILS,
    asyncCall: api.osm.fetchUserDetails,
  }),

  logout: () => (dispatch) => {
    api.osm.logout();
    dispatch({ type: UserConstants.USER_LOGOUT });
  },
};

export default UserActionCreators;
