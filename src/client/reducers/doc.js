import { handleActions } from 'redux-actions';

const defaultState = {};

const docReducer = handleActions({
  CREATE_DOC_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  CREATE_DOC_COMPLETED: (state) => ({
    ...state,
    isSending: false
  }),
  CREATE_DOC_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  }),
  LIST_DOCS_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  LIST_DOCS_COMPLETED: (state, action) => ({
    ...state,
    isSending: false,
    error: null,
    items: action.payload
  }),
  LIST_DOCS_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  }),
  GET_DOC_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  GET_DOC_COMPLETED: (state, action) => ({
    ...state,
    isSending: false,
    error: null,
    current: action.payload
  }),
  GET_DOC_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  })
},
  defaultState);

export default docReducer;
