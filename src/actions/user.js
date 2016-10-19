import osm from '../api/osm';

export const login = () => (dispatch) => {
  dispatch({ type: 'USER_LOGIN_REQUEST' });

  return osm.login().then(
    response => dispatch({
      type: 'USER_LOGIN_SUCCESS',
      response,
    }),
    error => dispatch({
      type: 'USER_LOGIN_FAILED',
      error: error.message || 'Failed to login.',
    })
  );
};

export const logout = () => (dispatch) => {
  dispatch({ type: 'USER_LOGOUT' });
  osm.logout();
);
