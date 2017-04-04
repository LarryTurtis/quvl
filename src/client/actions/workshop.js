import { createAction } from 'redux-actions';
import { buildPost, buildGet, buildPut } from '../util/requestFactory';

export const createWorkshopStart = createAction('CREATE_WORKSHOP_STARTED');
export const createWorkshopComplete = createAction('CREATE_WORKSHOP_COMPLETED');
export const createWorkshopFailure = createAction('CREATE_WORKSHOP_FAILED');

export const listWorkshopsStart = createAction('LIST_WORKSHOPS_STARTED');
export const listWorkshopsComplete = createAction('LIST_WORKSHOPS_COMPLETED');
export const listWorkshopsFailure = createAction('LIST_WORKSHOPS_FAILED');

export const updateWorkshopStart = createAction('UPDATE_WORKSHOP_STARTED');
export const updateWorkshopComplete = createAction('UPDATE_WORKSHOP_COMPLETED');
export const updateWorkshopFailure = createAction('UPDATE_WORKSHOP_FAILED');

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

export function listWorkshops(groupId, dateRange) {
  return (dispatch) => {
    const url = `/api/groups/${groupId}/workshops`;
    const inviteRequest = buildGet(url, null, dateRange);

    dispatch(listWorkshopsStart());
    return fetch(inviteRequest, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(json => dispatch(listWorkshopsComplete(json)))
      .catch(error => dispatch(listWorkshopsFailure(error)));
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
