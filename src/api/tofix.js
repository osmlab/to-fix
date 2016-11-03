import { TASK_SERVER_URL as baseURL } from '../config';

const toJSON = (response) => response.json();

const checkError = (response) => {
  const { statusCode } = response;
  if (statusCode && statusCode >= 400) {
    return Promise.reject(response.message || 'Something went wrong.');
  }
  return response;
};

const fetchJSON = (url, options = {}) => (
  fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  .then(toJSON)
  .then(checkError)
);

// Tasks
export const fetchAllTasks = () => (
  fetchJSON(`${baseURL}/tasks`)
);

export const fetchTaskById = ({ idtask }) => (
  fetchJSON(`${baseURL}/tasks/${idtask}`)
);

export const createTask = (payload) => (
  fetch(`${baseURL}/tasks`, { method: 'POST', body: payload }).then(toJSON).then(checkError)
);

export const updateTask = (payload) => (
  fetch(`${baseURL}/tasks`, { method: 'PUT', body: payload }).then(toJSON).then(checkError)
);

export const deleteTask = (payload) => (
  fetchJSON(`${baseURL}/tasks`, { method: 'DELETE', body: JSON.stringify(payload) })
);

// Items
export const fetchAllItems = ({ idtask }) => (
  fetchJSON(`${baseURL}/tasks/${idtask}/items`)
);

export const fetchRandomItem = ({ idtask, payload }) => (
  fetchJSON(`${baseURL}/tasks/${idtask}/items`, { method: 'POST', body: JSON.stringify(payload) })
);

export const fetchItemByKey = ({ idtask, key }) => (
  fetchJSON(`${baseURL}/tasks/${idtask}/items/${key}`)
);

export const fetchNItems = ({ idtask, numitems, payload }) => (
  fetchJSON(`${baseURL}/tasks/${idtask}/items/${numitems}`, { method: 'POST', body: JSON.stringify(payload) })
);

export const updateItem = ({ idtask, payload }) => (
  fetchJSON(`${baseURL}/tasks/${idtask}/items`, { method: 'PUT', body: JSON.stringify(payload) })
);

export const unlockItems = ({ idtask, groupIds }) => {
  groupIds = groupIds.join(',');
  return fetchJSON(`${baseURL}/tasks/${idtask}/items/unlocked`, { method: 'POST', body: JSON.stringify({ groupIds })})
};

// Activity
export const fetchActivity = ({ idtask, from, to }) => (
  fetchJSON(`${baseURL}/tasks/${idtask}/activity/from:${from}/to:${to}`)
);

export const fetchUserActivity = ({ idtask, user, from, to }) => (
  fetchJSON(`${baseURL}/tasks/${idtask}/activity/${user}/from:${from}/to:${to}`)
);

// Stats
export const fetchStats = ({ idtask, from, to }) => (
  fetchJSON(`${baseURL}/tasks/${idtask}/track_stats/from:${from}/to:${to}`)
);
