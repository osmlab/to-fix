import { normalize } from 'normalizr';

export const asyncAction = ({ type, asyncCall, responseSchema }) => {
  return (params = {}) => (dispatch) => {
    dispatch({
      type: `${type}_REQUEST`,
      ...params,
    });

    return asyncCall(params).then(
      response => dispatch({
        type: `${type}_SUCCESS`,
        response: responseSchema ? normalize(response, responseSchema) : response,
        params,
      }),
      error => dispatch({
        type: `${type}_FAILURE`,
        error,
      })
    );
  };
};
