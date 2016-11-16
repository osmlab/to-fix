import LoadingConstants from '../constants/loading_constants';

const LoadingActionCreators = {
  startLoading: () => ({
    type: LoadingConstants.LOADING_START,
  }),

  stopLoading: () => ({
    type: LoadingConstants.LOADING_STOP,
  }),
};

export default LoadingActionCreators;
