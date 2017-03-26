import { handleActions } from 'redux-actions';

const defaultState = {};

const reportReducer = handleActions({
  REPORT_STARTED: (state) => ({
    ...state,
    isFetching: true
  }),
  REPORT_COMPLETED: (state, action) => ({
    ...state,
    isFetching: false,
    items: action.payload.items
  }),
  REPORT_FAILED: (state, action) => ({
    ...state,
    isFetching: false,
    error: action.payload.message
  })
},
  defaultState);

export default reportReducer;
