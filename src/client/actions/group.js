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

export const createWorkshopStart = createAction('CREATE_WORKSHOP_STARTED');
export const createWorkshopComplete = createAction('CREATE_WORKSHOP_COMPLETED');
export const createWorkshopFailure = createAction('CREATE_WORKSHOP_FAILED');

export const updateWorkshopStart = createAction('UPDATE_WORKSHOP_STARTED');
export const updateWorkshopComplete = createAction('UPDATE_WORKSHOP_COMPLETED');
export const updateWorkshopFailure = createAction('UPDATE_WORKSHOP_FAILED');

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

export function createWorkshop(groupId, date, slots) {
  return (dispatch) => {
    const url = `/api/groups/${groupId}/workshops`;
    const body = JSON.stringify({ date, slots });
    const inviteRequest = buildPost(url, body);

    dispatch(createWorkshopStart());
    return fetch(inviteRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(createWorkshopComplete(json)))
      .catch(error => dispatch(createWorkshopFailure(error)));
  };
}

export function updateWorkshop(groupId, workshopId, data) {
  return (dispatch) => {
    const url = `/api/groups/${groupId}/workshops/${workshopId}`;
    const body = JSON.stringify(data);
    const addRequest = buildPut(url, body);

    dispatch(updateWorkshopStart());
    return fetch(addRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(updateWorkshopComplete(json)))
      .catch(error => dispatch(updateWorkshopFailure(error)));
  };
}
