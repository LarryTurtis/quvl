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
  ADD_MEMBER_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  ADD_MEMBER_COMPLETED: (state, action) => ({
    ...state,
    isSending: false,
    items: state.items.map(item => {
      console.log(item, action.payload);
      if (item.groupId === action.payload.groupId) {
        return action.payload;
      }
      return item;
    })
  }),
  ADD_MEMBER_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  }),
  REMOVE_MEMBER_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  REMOVE_MEMBER_COMPLETED: (state) => ({
    ...state,
    isSending: false
  }),
  REMOVE_MEMBER_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  })
},
  defaultState);

export default group;
