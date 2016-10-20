import { TASK_SERVER_URL as baseURL } from '../config';

export const fetchAllTasks = () =>
  fetch(`${baseURL}/tasks`)
    .then(response => response.json());

export const fetchTask = (idtask) =>
  fetch(`${baseURL}/tasks/${idtask}`)
    .then(response => response.json());

export const createTask = (params) =>
  fetch(`${baseURL}/tasks`, { method: 'POST', body: params })
    .then(response => response.json());

export const updateTask = (params) =>
  fetch(`${baseURL}/tasks`, { method: 'PUT', body: params })
    .then(response => response.json());

export const deleteTask = (params) =>
  fetch(`${baseURL}/tasks`, { method: 'DELETE', body: params })
    .then(response => response.json());

export const fetchTaskActivity = (idtask, from, to) =>
  fetch(`${baseURL}/tasks/${idtask}/activity/${from}/${to}`)
    .then(response => response.json());

export const fetchUserActivity = (idtask, user, from , to) =>
  fetch(`${baseURL}/tasks/${idtask}/activity/${user}/${from}/${to}`)
    .then(response => response.json());

export const fetchAllItems = (idtask) =>
  fetch(`${baseURL}/tasks/${idtask}/items`)
    .then(response => response.json());

export const fetchRandomItem = (idtask, params) =>
  fetch(`${baseURL}/tasks/${idtask}/items`, { method: 'POST', body: params })
    .then(response => response.json());

export const updateItem = (idtask, params) =>
  fetch(`${baseURL}/tasks/${idtask}/items`, { method: 'PUT', body: params })
    .then(response => response.json());

export const fetchItem = (idtask, key) =>
  fetch(`${baseURL}/tasks/${idtask}/items/${key}`)
    .then(response => response.json());

export const fetchNItems = (idtask, numitems, params) =>
  fetch(`${baseURL}/tasks/${idtask}/items/${numitems}`, { method: 'POST', body: params })
    .then(response => response.json);

export const unlockItems = (idtask, groupIds) => {
  groupIds = JSON.stringify(groupIds);
  return fetch(`${baseURL}/tasks/${idtask}/items/unlocked`, { method: 'POST', body: { groupIds }})
    .then(response => response.json());
};

export const fetchTaskStats = (idtask, from, to) =>
  fetch(`${baseURL}/${idtask}/track_stats/${from}/${to}`)
    .then(response => response.json());
