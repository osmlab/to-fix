export const toJSON = (response) => response.json();

export const checkError = (response) => {
  const { statusCode } = response;
  if (statusCode && statusCode >= 400) {
    return Promise.reject(response.message || 'Something went wrong.');
  }
  return response;
};

export const fetchJSON = (url, options = {}) => (
  fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then(toJSON)
  .then(checkError)
);

export const fetchForm = (url, options = {}) => (
  fetch(url, { ...options })
    .then(toJSON)
    .then(checkError)
);
