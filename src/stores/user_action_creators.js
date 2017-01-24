import { server } from '../services';
import { asyncAction } from './async_action';
import UserConstants from '../constants/user_constants';

const UserActionCreators = {
  login: (creds) => (dispatch) => {
    dispatch({
      type: UserConstants.USER_LOGGED_IN,
      creds,
    });
  },

  fetchUserDetails: asyncAction({
    type: UserConstants.USER_FETCH_USER_DETAILS,
    asyncCall: server.fetchUserDetails,
  }),

  logout: asyncAction({
    type: UserConstants.USER_LOGOUT,
    asyncCall: server.logout,
  }),
};

export default UserActionCreators;
