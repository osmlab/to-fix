import LoadingConstants from '../constants/loading_constants';

const initialState = false;

const loading = (state = initialState, action) => {
  switch(action.type) {
    case LoadingConstants.LOADING_START:
      return true;
    case LoadingConstants.LOADING_STOP:
      return false;
    default:
      return state;
  }
}

export default loading;
