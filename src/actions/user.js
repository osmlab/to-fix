import * as osmApi from '../api/osm_api';
import * as store from '../util/localStorage';

export const login = () => (dispatch) => {
  dispatch({ type: 'USER_LOGIN_REQUEST' });

  return osmApi.login().then(
    response => {
      dispatch({
        type: 'USER_LOGIN_SUCCESS',
        response,
      });

      store.set('osmid', response.osmid);
      store.set('username', response.username);
      store.set('avatar', response.avatar);
    },
    error => dispatch({
      type: 'USER_LOGIN_FAILED',
      error: error.message || 'Failed to login.',
    })
  );
};

export const logout = () => (dispatch) => {
  osmApi.logout();

  store.remove('osmid');
  store.remove('username');
  store.remove('avatar');

  dispatch({ type: 'USER_LOGOUT' });
};
