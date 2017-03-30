import { createAction } from 'redux-actions';
import { buildPost } from '../util/requestFactory';

export const commentStart = createAction('COMMENT_STARTED');
export const commentComplete = createAction('COMMENT_COMPLETED');
export const commentFailure = createAction('COMMENT_FAILED');

export function saveComment(authorId, docId, nodes, comment) {
  return (dispatch) => {
    const url = `/docs/${authorId}/${docId}`;
    const body = JSON.stringify({ nodes, comment });
    const inviteRequest = buildPost(url, body);

    dispatch(commentStart());
    return fetch(inviteRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(commentComplete(json)))
      .catch(error => dispatch(commentFailure(error)));
  };
}