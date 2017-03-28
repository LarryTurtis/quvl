import { createAction } from 'redux-actions';
import { buildGet } from '../util/requestFactory';

export const request = createAction('SITES_STARTED');
export const receive = createAction('SITES_COMPLETED');
export const failure = createAction('SITES_FAILED');

export function fetchSites() {
  return (dispatch, getState) => {
    const token = getState().login.user && getState().login.user.token;
    const url = '/api/publisher/sites';
    const siteRequest = buildGet(url, token);

    dispatch(request());
    return fetch(siteRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(receive(json)))
      .catch(error => dispatch(failure(error)));
  };
}
