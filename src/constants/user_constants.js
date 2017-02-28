import keymirror from 'keymirror';

const UserConstants = keymirror({
  USER_LOGGED_IN: null,
  USER_FETCH_USER_DETAILS: null,
  USER_LOGOUT: null,
});

export default UserConstants;

export const ROLES = {
  EDITOR: 'editor',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
};
