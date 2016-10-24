const isUserAction = /^user/

const user = (state = {}, action) => {
  if (!isUserAction.test(action.type)) return state;

  const type = action.type.substring('user/'.length);
  switch(type) {
    case 'USER_LOGIN_SUCCESS':
      return {
        authenticated: true,
      };
    case 'USER_LOGIN_FAILURE':
      return {
        authenticated: false,
        error: action.error,
      }
    case 'GET_USER_DETAILS_SUCCESS':
      return {
        authenticated: true,
        ...action.response,
      };
    case 'GET_USER_DETAILS_FAILURE':
      return {
        authenticated: false,
        error: action.error,
      };
    case 'USER_LOGOUT':
      return {
        authenticated: false,
      };
    default:
      return state;
  }
};

export default user;
