export const get = (key) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedValue);
  } catch (err) {
    console.error('Could not read from localStorage.');
    return undefined;
  }
};

export const set = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (err) {
    console.error('Could not write to localStorage.');
  }
};
