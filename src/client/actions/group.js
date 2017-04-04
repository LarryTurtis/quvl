import { createAction } from 'redux-actions';
import { buildPost, buildGet, buildPut } from '../util/requestFactory';

export const createGroupStart = createAction('CREATE_GROUP_STARTED');
export const createGroupComplete = createAction('CREATE_GROUP_COMPLETED');
export const createGroupFailure = createAction('CREATE_GROUP_FAILED');

export const listGroupStart = createAction('LIST_GROUP_STARTED');
export const listGroupComplete = createAction('LIST_GROUP_COMPLETED');
export const listGroupFailure = createAction('LIST_GROUP_FAILED');

export const updateMemberStart = createAction('UPDATE_MEMBER_STARTED');
export const updateMemberComplete = createAction('UPDATE_MEMBER_COMPLETED');
export const updateMemberFailure = createAction('UPDATE_MEMBER_FAILED');

export function createGroup(name, emails) {
  return (dispatch) => {
    const url = '/api/groups';
    const body = JSON.stringify({ name, emails });
    const inviteRequest = buildPost(url, body);

    dispatch(createGroupStart());
    return fetch(inviteRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(createGroupComplete(json)))
      .catch(error => dispatch(createGroupFailure(error)));
  };
}

export function listGroups() {
  return (dispatch) => {
    const url = '/api/groups';
    const inviteRequest = buildGet(url);

    dispatch(listGroupStart());
    return fetch(inviteRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(listGroupComplete(json)))
      .catch(error => dispatch(listGroupFailure(error)));
  };
}

export function updateMember(groupId, data) {
  return (dispatch) => {
    const url = `/api/groups/${groupId}`;
    const body = JSON.stringify(data);
    const addRequest = buildPut(url, body);

    dispatch(updateMemberStart());
    return fetch(addRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(updateMemberComplete(json)))
      .catch(error => dispatch(updateMemberFailure(error)));
  };
}
