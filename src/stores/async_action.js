import keymirror from 'keymirror';
import { normalize } from 'normalizr';

import LoadingActionCreators from './loading_action_creators';
import ModalsActionCreators from './modals_action_creators';

export const AsyncStatus = keymirror({
  REQUEST: null,
  SUCCESS: null,
  FAILURE: null,
});

export const checkStatusCode = (response) => {
  const { statusCode } = response;
  if (statusCode && statusCode >= 400) {
    return Promise.reject(response.message || 'Something went wrong.');
  }
  return response;
};

export const asyncAction = ({ type, asyncCall, responseSchema, showLoader = false }) => {
  return (params = {}) => (dispatch) => {
    dispatch({
      type,
      status: AsyncStatus.REQUEST,
      ...params,
    });

    if (showLoader) dispatch(LoadingActionCreators.startLoading());

    return asyncCall(params)
      .then(checkStatusCode)
      .then(
        response => {
          dispatch({
            type,
            status: AsyncStatus.SUCCESS,
            response: responseSchema ? normalize(response, responseSchema) : response,
            params,
          });
          if (showLoader) dispatch(LoadingActionCreators.stopLoading());
        },
        error => {
          dispatch({
            type,
            status: AsyncStatus.FAILURE,
            error,
          });
          if (showLoader) dispatch(LoadingActionCreators.stopLoading());
          dispatch(ModalsActionCreators.openErrorModal(error));
        }
      );
  };
};
