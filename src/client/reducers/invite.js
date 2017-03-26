import { handleActions } from 'redux-actions';

const defaultState = {};

const inviteReducer = handleActions({
  INVITE_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  INVITE_COMPLETED: (state) => ({
    ...state,
    isSending: false
  }),
  INVITE_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  })
},
  defaultState);

export default inviteReducer;
