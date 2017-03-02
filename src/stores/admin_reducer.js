import AdminConstants from '../constants/admin_constants';
import UserConstants from '../constants/user_constants';
import { AsyncStatus } from './async_action';

const initialState = {
  users: [],
};

const admin = (state = initialState, action) => {
  switch(action.type) {
    case AdminConstants.ADMIN_FETCH_ALL_USERS:
      if (action.status === AsyncStatus.SUCCESS) {
        return {
          users: action.response.users,
        };
      }
      return state;
    case AdminConstants.ADMIN_CHANGE_USER_ROLE:
      if (action.status === AsyncStatus.SUCCESS) {
        const { payload: { iduser, role } } = action.params;
        const users = state.users.map(u => {
          if (u.id == iduser) {
            u.role = role;
          }
          return u;
        });
        return {
          users,
        };
      }
      return state;
    case UserConstants.USER_LOGOUT:
      return {
        users: [],
      };
    default:
      return state;
  }
};

export default admin;
