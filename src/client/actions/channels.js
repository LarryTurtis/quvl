import { createAction } from 'redux-actions';
import { buildGet } from '../util/requestFactory';

export const request = createAction('CHANNELS_STARTED');
export const receive = createAction('CHANNELS_COMPLETED');
export const failure = createAction('CHANNELS_FAILED');

export function fetchChannels() {
  return (dispatch, getState) => {
    const token = getState().auth.user.token;
    const url = '/api/admin/channels';
    const channelRequest = buildGet(url, token);

    dispatch(request());
    return fetch(channelRequest)
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
