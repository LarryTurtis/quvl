import { handleActions } from 'redux-actions';

const defaultState = {};

const sitesReducer = handleActions({
  SITES_STARTED: (state) => ({
    ...state,
    isFetching: true
  }),
  SITES_COMPLETED: (state, action) => ({
    ...state,
    isFetching: false,
    items: action.payload.items
  }),
  SITES_FAILED: (state, action) => ({
    ...state,
    isFetching: false,
    error: action.payload.message
  })
},
  defaultState);

export default sitesReducer;
