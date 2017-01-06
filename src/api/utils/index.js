export const toJSON = (response) => response.json();

export const fetchJSON = (url, options = {}) => (
  fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  .then(toJSON)
);

export const fetchForm = (url, options = {}) => (
  fetch(url, {
    ...options,
    headers: {
      ...options.headers,
    }
  })
    .then(toJSON)
);
