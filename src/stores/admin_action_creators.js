import { server } from '../services';
import { asyncAction } from './async_action';
import AdminConstants from '../constants/admin_constants';

const AdminActionCreators = {
  fetchAllUsers: asyncAction({
    type: AdminConstants.ADMIN_FETCH_ALL_USERS,
    asyncCall: server.fetchAllUsers,
    showLoader: true,
  }),

  changeUserRole: asyncAction({
    type: AdminConstants.ADMIN_CHANGE_USER_ROLE,
    asyncCall: server.changeUserRole,
    showLoader: true,
    showError: false,
  }),
};

export default AdminActionCreators;
