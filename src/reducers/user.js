const isUserAction = /^user/

const user = (state = {}, action) => {
  if (!isUserAction.test(action.type)) return state;

  switch(action.type) {
    case 'user/USER_LOGIN_SUCCESS':
      return {
        authenticated: true,
      };
    case 'user/USER_LOGIN_FAILURE':
      return {
        authenticated: false,
        error: action.error,
      }
    case 'user/GET_USER_DETAILS_SUCCESS':
      return {
        authenticated: true,
        ...action.response,
      };
    case 'user/GET_USER_DETAILS_FAILURE':
      return {
        authenticated: false,
        error: action.error,
      };
    case 'user/USER_LOGOUT':
      return {
        authenticated: false,
      };
    default:
      return state;
  }
};

export default user;
