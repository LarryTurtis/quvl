import { handleActions } from 'redux-actions';

const defaultState = {};

const workshop = handleActions({
  CREATE_WORKSHOP_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  CREATE_WORKSHOP_COMPLETED: (state, action) => ({
    ...state,
    isSending: false,
    items: state.items.map(item => {
      if (item[0] && item[0].group._id === action.payload.group._id) {
        return [...item, action.payload];
      }
      return item;
    })
  }),
  CREATE_WORKSHOP_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  }),
  LIST_WORKSHOPS_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  LIST_WORKSHOPS_COMPLETED: (state, action) => ({
    ...state,
    isSending: false,
    items: action.payload
  }),
  LIST_WORKSHOPS_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  }),
  UPDATE_WORKSHOP_STARTED: (state) => ({
    ...state,
    isSending: true
  }),
  UPDATE_WORKSHOP_COMPLETED: (state, action) => ({
    ...state,
    isSending: false,
    items: state.items.map(item => {
      if (item.workshopId === action.payload.workshopId) {
        return action.payload;
      }
      return item;
    })
  }),
  UPDATE_WORKSHOP_FAILED: (state, action) => ({
    ...state,
    isSending: false,
    error: action.payload.message
  })
},
  defaultState);

export default workshop;
