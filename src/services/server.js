import { TASK_SERVER_URL as baseURL } from '../config';

const toJSON = response => response.json();

// Status
export const status = () =>
  fetch(`${baseURL}`)
    .then(toJSON);

// User
export const fetchAllUsers = (token) =>
  fetch(`${baseURL}/user`, {
    headers: {
      'Authorization': token,
    },
  })
    .then(toJSON);

export const changeUserRole = (token, payload) =>
  fetch(`${baseURL}/user`, {
    method: 'PUT',
    headers: {
      'Authorization': token,
    },
    body: payload,
  })
    .then(toJSON);

export const destroyUser = (token, payload) =>
  fetch(`${baseURL}/user`, {
    method: 'DELETE',
    headers: {
      'Authorization': token,
    },
    body: payload,
  })
    .then(toJSON);

export const loginURL =
  `${baseURL}/connect/openstreetmap`;

export const logout = (token) =>
  fetch(`${baseURL}/logout`, {
    headers: {
      'Authorization': token,
    },
  })
    .then(toJSON);

// Tasks
export const fetchAllTasks = () =>
  fetch(`${baseURL}/tasks`)
    .then(toJSON);

export const fetchTaskById = (id) =>
  fetch(`${baseURL}/tasks/${id}`)
    .then(toJSON);

export const createTask = (token, payload) =>
  fetch(`${baseURL}/tasks`, {
    method: 'POST',
    headers: {
      'Authorization': token,
    },
    body: payload,
  })
    .then(toJSON);

export const updateTask = (token, payload) =>
  fetch(`${baseURL}/tasks`, {
    method: 'PUT',
    headers: {
      'Authorization': token,
    },
    body: payload,
  })
    .then(toJSON)

export const destroyTask = (token, payload) =>
  fetch(`${baseURL}/tasks`, {
    method: 'DELETE',
    headers: {
      'Authorization': token,
    },
    body: payload,
  })
    .then(toJSON);

// Items
export const fetchItemsCount = (id, type) =>
  fetch(`${baseURL}/tasks/${id}/${type}/count`)
    .then(toJSON);

export const fetchAllItems = (id, type) =>
  fetch(`${baseURL}/tasks/${id}/${type}/items`)
    .then(toJSON);

export const fetchRandomItem = (id, type, payload) =>
  fetch(`${baseURL}/tasks/${id}/${type}/items`, {
    method: 'POST',
    body: payload,
  })
    .then(toJSON);

export const updateItem = (id, type, payload) =>
  fetch(`${baseURL}/tasks/${id}/${type}/items`, {
    method: 'PUT',
    body: payload,
  })
    .then(toJSON);

// Activity
export const fetchRecentActivity = (id) =>
  fetch(`${baseURL}/tasks/${id}/activity`)
    .then(toJSON);

// Stats
export const fetchAllStats = (id, from, to) =>
  fetch(`${baseURL}/tasks/${id}/track_stats/from:${from}/to:${to}`)
    .then(toJSON);
