import { handleActions } from 'redux-actions';

const defaultState = {};

const channelsReducer = handleActions({
  CHANNELS_STARTED: (state) => ({
    ...state,
    isFetching: true
  }),
  CHANNELS_COMPLETED: (state, action) => ({
    ...state,
    isFetching: false,
    items: action.payload.items
  }),
  CHANNELS_FAILED: (state, action) => ({
    ...state,
    isFetching: false,
    error: action.payload.message
  })
},
  defaultState);

export default channelsReducer;
