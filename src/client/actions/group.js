import { createAction } from 'redux-actions';
import { buildPost } from '../util/requestFactory';

export const groupStart = createAction('GROUP_STARTED');
export const groupComplete = createAction('GROUP_COMPLETED');
export const groupFailure = createAction('GROUP_FAILED');

export function createGroup(name, emails) {
  return (dispatch) => {
    const url = '/groups';
    const body = JSON.stringify({ name, emails });
    const inviteRequest = buildPost(url, body);

    dispatch(groupStart());
    return fetch(inviteRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(groupComplete(json)))
      .catch(error => dispatch(groupFailure(error)));
  };
}
