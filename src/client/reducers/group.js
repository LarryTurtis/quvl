import { handleActions } from 'redux-actions';

const defaultState = {};

const group = handleActions({
  GROUP_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  GROUP_COMPLETED: (state) => ({
    ...state,
    isSending: false
  }),
  GROUP_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  })
},
  defaultState);

export default group;
