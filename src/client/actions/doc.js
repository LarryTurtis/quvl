import { createAction } from 'redux-actions';
import { buildGet, buildPost } from '../util/requestFactory';

export const createStart = createAction('CREATE_DOC_STARTED');
export const createComplete = createAction('CREATE_DOC_COMPLETED');
export const createFailure = createAction('CREATE_DOC_FAILED');

export const listStart = createAction('LIST_DOCS_STARTED');
export const listComplete = createAction('LIST_DOCS_COMPLETED');
export const listFailure = createAction('LIST_DOCS_FAILED');

export const getStart = createAction('GET_DOC_STARTED');
export const getComplete = createAction('GET_DOC_COMPLETED');
export const getFailure = createAction('GET_DOC_FAILED');

export function createDoc(name, doc) {
  return (dispatch) => {
    const url = '/save';
    const body = JSON.stringify({ name, doc });
    const inviteRequest = buildPost(url, body);

    dispatch(createStart());
    return fetch(inviteRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(createComplete(json)))
      .catch(error => dispatch(createFailure(error)));
  };
}

export function listDocs() {
  return (dispatch, getState) => {
    const state = getState();
    const userId = state.login.user && state.login.user.userId;
    const url = `/docs/${userId}`;
    const inviteRequest = buildGet(url);

    dispatch(listStart());
    return fetch(inviteRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(listComplete(json)))
      .catch(error => dispatch(listFailure(error)));
  };
}

export function getDoc(userId, docId) {
  return (dispatch) => {
    const url = `/docs/${userId}/${docId}`;
    const inviteRequest = buildGet(url);

    dispatch(getStart());
    return fetch(inviteRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(getComplete(json)))
      .catch(error => dispatch(getFailure(error)));
  };
}