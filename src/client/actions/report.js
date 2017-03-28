import { createAction } from 'redux-actions';
import { buildGet } from '../util/requestFactory';

export const request = createAction('REPORT_STARTED');
export const receive = createAction('REPORT_COMPLETED');
export const failure = createAction('REPORT_FAILED');

export function fetchReport(options) {
  return (dispatch, getState) => {
    const token = getState().login.user && getState().login.user.token;
    const url = '/api/publisher/report';
    const reportRequest = buildGet(url, token, options);

    dispatch(request());
    return fetch(reportRequest, {
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
