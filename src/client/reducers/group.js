import { handleActions } from 'redux-actions';

const defaultState = {};

const group = handleActions({
  CREATE_GROUP_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  CREATE_GROUP_COMPLETED: (state, action) => ({
    ...state,
    isSending: false,
    items: [...state.items, action.payload]
  }),
  CREATE_GROUP_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  }),
  LIST_GROUP_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  LIST_GROUP_COMPLETED: (state, action) => ({
    ...state,
    isSending: false,
    items: action.payload
  }),
  LIST_GROUP_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  }),
  UPDATE_MEMBER_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  UPDATE_MEMBER_COMPLETED: (state, action) => ({
    ...state,
    isSending: false,
    items: state.items.map(item => {
      if (item.groupId === action.payload.groupId) {
        return action.payload;
      }
      return item;
    })
  }),
  UPDATE_MEMBER_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  }),
  CREATE_WORKSHOP_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  CREATE_WORKSHOP_COMPLETED: (state, action) => ({
    ...state,
    isSending: false,
    items: state.items.map(item => {
      if (item.groupId === action.payload.groupId) {
        return action.payload;
      }
      return item;
    })
  }),
  CREATE_WORKSHOP_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  }),
  UPDATE_WORKSHOP_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  UPDATE_WORKSHOP_COMPLETED: (state) => ({
    ...state,
    isSending: false
  }),
  UPDATE_WORKSHOP_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  })
},
  defaultState);

export default group;
