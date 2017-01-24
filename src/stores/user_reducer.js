import UserConstants from '../constants/user_constants';
import { AsyncStatus } from './async_action';

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

    case UserConstants.USER_FETCH_USER_DETAILS:
      switch(action.status) {
        case AsyncStatus.SUCCESS:
          return {
            isAuthenticated: true,
            osmid: action.response.id,
            username: action.response.user,
            avatar: action.response.img,
            role: action.response.role,
            token: action.params.token
          };
        case AsyncStatus.FAILURE:
          return {
            isAuthenticated: false,
            token: null,
          };
        default:
          return state;
      }

    case UserConstants.USER_LOGOUT:
      return {
        isAuthenticated: false,
        token: null,
      };

    default:
      return state;
  }
};

export default user;
