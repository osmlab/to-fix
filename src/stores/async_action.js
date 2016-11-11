import keymirror from 'keymirror';
import { normalize } from 'normalizr';

export const AsyncStatus = keymirror({
  REQUEST: null,
  SUCCESS: null,
  FAILURE: null,
});

export const asyncAction = ({ type, asyncCall, responseSchema }) => {
  return (params = {}) => (dispatch) => {
    dispatch({
      type,
      status: AsyncStatus.REQUEST,
      ...params,
    });

    return asyncCall(params).then(
      response => dispatch({
        type,
        status: AsyncStatus.SUCCESS,
        response: responseSchema ? normalize(response, responseSchema) : response,
        params,
      }),
      error => dispatch({
        type,
        status: AsyncStatus.FAILURE,
        error,
      })
    );
  };
};
