import { createAction } from 'redux-actions';
import { buildPost } from '../util/requestFactory';

export const send = createAction('INVITE_STARTED');
export const complete = createAction('INVITE_COMPLETED');
export const failure = createAction('INVITE_FAILED');

export function sendInvite(email, channelId) {
  return (dispatch, getState) => {
    const token = getState().auth.user.token;
    const url = '/api/admin/invite';
    const body = JSON.stringify({ email, channelId });
    const inviteRequest = buildPost(url, body, token);

    dispatch(send());
    return fetch(inviteRequest)
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
