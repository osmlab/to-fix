const user = (state = {}, action) => {
  switch(action.type) {
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
        ...state,
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
