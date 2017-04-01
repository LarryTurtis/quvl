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
    items: {
      members: [...state.items.members, action.payload],
      admins: [...state.items.admins, action.payload]
    }
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
  })
},
  defaultState);

export default group;
