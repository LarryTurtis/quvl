import { createAction } from 'redux-actions';
import { buildPost, buildGet } from '../util/requestFactory';

export const send = createAction('LOGIN_STARTED');
export const complete = createAction('LOGIN_COMPLETED');
export const failure = createAction('LOGIN_FAILED');

export function doLogin(email, password) {
  return (dispatch) => {
    const url = '/api/login';
    const body = JSON.stringify({ email, password });
    const inviteRequest = buildPost(url, body);

    dispatch(send());
    return fetch(inviteRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(complete(json)))
      .catch(error => dispatch(failure(error)));
  };
}

export function doSignup(email, password) {
  return (dispatch) => {
    const url = '/api/signup';
    const body = JSON.stringify({ email, password });
    const inviteRequest = buildPost(url, body);

    dispatch(send());
    return fetch(inviteRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(complete(json)))
      .catch(error => dispatch(failure(error)));
  };
}

export function doLogout() {
  return (dispatch) => {
    const url = '/api/logout';
    const inviteRequest = buildGet(url);

    dispatch(send());
    return fetch(inviteRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(complete(json)))
      .catch(error => dispatch(failure(error)));
  };
}

export function checkLogin() {
  return (dispatch) => {
    const url = '/api/login';
    const inviteRequest = buildGet(url);

    dispatch(send());
    return fetch(inviteRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(complete(json)))
      .catch(error => dispatch(failure(error)));
  };
}