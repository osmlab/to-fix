import UserConstants from '../constants/user_constants';

const initialState = {
  isAuthenticated: false,
  osmid: null,
  username: null,
  avatar: null,
  role: null,
  token: null,
};

const user = (state = initialState, action) => {
  switch(action.type) {
    case UserConstants.USER_LOGGED_IN:
      return {
        isAuthenticated: true,
        osmid: action.creds.id,
        username: action.creds.user,
        avatar: action.creds.img,
        role: action.creds.role,
        token: action.creds.token
      };

    case UserConstants.USER_LOGGED_OUT:
      return {
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

export default user;
