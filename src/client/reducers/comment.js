import { handleActions } from 'redux-actions';

const defaultState = {};

const comment = handleActions({
  COMMENT_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  COMMENT_COMPLETED: (state) => ({
    ...state,
    isSending: false
  }),
  COMMENT_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  })
},
  defaultState);

export default comment;
