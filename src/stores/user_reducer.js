import UserConstants from '../constants/user_constants';
import { AsyncStatus } from './async_action';

const initialState = {
  isAuthenticated: false,
  osmid: null,
  username: null,
  avatar: null,
};

const user = (state = initialState, action) => {
  switch(action.type) {
    case UserConstants.USER_LOGIN:
      switch(action.status) {
        case AsyncStatus.SUCCESS:
          return {
            isAuthenticated: true,
          };
        case AsyncStatus.FAILURE:
          return {
            isAuthenticated: false,
          };
        default:
          return state;
      }

    case UserConstants.USER_FETCH_USER_DETAILS:
      switch(action.status) {
        case AsyncStatus.SUCCESS:
          return {
            isAuthenticated: true,
            ...action.response,
          };
        case AsyncStatus.FAILURE:
          return {
            isAuthenticated: false,
          };
        default:
          return state;
      }

    case UserConstants.USER_LOGOUT:
      return {
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

export default user;
