import { TASK_SERVER_URL as baseURL } from '../config';

const toJSON = response => response.json();

// Status
export const status = () => (
  fetch(`${baseURL}`)
    .then(toJSON)
);

// User
export const loginURL =
  `${baseURL}/connect/openstreetmap`;

export const fetchUserDetails = ({ token }) => (
  fetch(`${baseURL}/user/details`, {
    headers: {
      'Authorization': token,
    },
  })
    .then(toJSON)
);

export const logout = ({ token }) => (
  fetch(`${baseURL}/logout`, {
    headers: {
      'Authorization': token,
    },
  })
    .then(toJSON)
);

// Admin
export const fetchAllUsers = ({ token }) => (
  fetch(`${baseURL}/user`, {
    headers: {
      'Authorization': token,
    },
  })
    .then(toJSON)
);

export const changeUserRole = ({ token, payload }) => (
  fetch(`${baseURL}/user`, {
    method: 'PUT',
    headers: {
      'Authorization': token,
    },
    body: payload,
  })
    .then(toJSON)
);

export const destroyUser = ({ token, payload }) => (
  fetch(`${baseURL}/user`, {
    method: 'DELETE',
    headers: {
      'Authorization': token,
    },
    body: payload,
  })
    .then(toJSON)
);

// Tasks
export const fetchAllTasks = () => (
  fetch(`${baseURL}/tasks`)
    .then(toJSON)
);

export const fetchTaskById = ({ taskId }) => (
  fetch(`${baseURL}/tasks/${taskId}`)
    .then(toJSON)
);

export const createTask = ({ token, payload }) => (
  fetch(`${baseURL}/tasks`, {
    method: 'POST',
    headers: {
      'Authorization': token,
    },
    body: payload,
  })
    .then(toJSON)
);

export const updateTask = ({ token, payload }) => (
  fetch(`${baseURL}/tasks`, {
    method: 'PUT',
    headers: {
      'Authorization': token,
    },
    body: payload,
  })
    .then(toJSON)
);

export const destroyTask = ({ token, payload }) => (
  fetch(`${baseURL}/tasks`, {
    method: 'DELETE',
    headers: {
      'Authorization': token,
    },
    body: payload,
  })
    .then(toJSON)
);

// Items
export const fetchRandomItem = ({ taskId, taskType, payload }) => (
  fetch(`${baseURL}/tasks/${taskId}/${taskType}/items`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
    .then(toJSON)
);

export const updateItem = ({ taskId, taskType, payload }) => (
  fetch(`${baseURL}/tasks/${taskId}/${taskType}/items`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
    .then(toJSON)
);

// Activity
export const fetchRecentActivity = ({ taskId }) => (
  fetch(`${baseURL}/tasks/${taskId}/activity`)
    .then(toJSON)
);

// Stats
export const fetchAllStats = ({ taskId, from, to }) => (
  fetch(`${baseURL}/tasks/${taskId}/track_stats/from:${from}/to:${to}`)
    .then(toJSON)
);
