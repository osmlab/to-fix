import UserConstants from '../constants/user_constants';

const UserActionCreators = {
  login: (creds) => (dispatch) => {
    dispatch({
      type: UserConstants.USER_LOGGED_IN,
      creds,
    });
  },

  logout: () => (dispatch) => {
    dispatch({
      type: UserConstants.USER_LOGGED_OUT
    });
  },
};

export default UserActionCreators;
