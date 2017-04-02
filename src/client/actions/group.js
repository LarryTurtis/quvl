import { createAction } from 'redux-actions';
import { buildPost, buildGet, buildPut } from '../util/requestFactory';

export const createGroupStart = createAction('CREATE_GROUP_STARTED');
export const createGroupComplete = createAction('CREATE_GROUP_COMPLETED');
export const createGroupFailure = createAction('CREATE_GROUP_FAILED');

export const listGroupStart = createAction('LIST_GROUP_STARTED');
export const listGroupComplete = createAction('LIST_GROUP_COMPLETED');
export const listGroupFailure = createAction('LIST_GROUP_FAILED');

export const addMemberStart = createAction('ADD_MEMBER_STARTED');
export const addMemberComplete = createAction('ADD_MEMBER_COMPLETED');
export const addMemberFailure = createAction('ADD_MEMBER_FAILED');

export const removeMemberStart = createAction('REMOVE_MEMBER_STARTED');
export const removeMemberComplete = createAction('REMOVE_MEMBER_COMPLETED');
export const removeMemberFailure = createAction('REMOVE_MEMBER_FAILED');

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

export function addMember(groupId, member) {
  return (dispatch) => {
    const url = `/api/groups/${groupId}`;
    const body = JSON.stringify({ type: 'ADD', member });
    const addRequest = buildPut(url, body);

    dispatch(addMemberStart());
    return fetch(addRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(addMemberComplete(json)))
      .catch(error => dispatch(addMemberFailure(error)));
  };
}

export function removeMember(groupId, member) {
  return (dispatch) => {
    const url = `/api/groups/${groupId}`;
    const body = JSON.stringify({ type: 'REMOVE', member });
    const removeRequest = buildPut(url, body);

    dispatch(removeMemberStart());
    return fetch(removeRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(removeMemberComplete(json)))
      .catch(error => dispatch(removeMemberFailure(error)));
  };
}
