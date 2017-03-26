import { handleActions } from 'redux-actions';

const defaultState = {};

const loginReducer = handleActions({
  LOGIN_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  LOGIN_COMPLETED: (state) => ({
    ...state,
    isSending: false
  }),
  LOGIN_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  })
},
  defaultState);

export default loginReducer;
