import { Schema, arrayOf } from 'normalizr';

const task = new Schema('tasks', { idAttribute: 'idtask' });
const arrayOfTasks = arrayOf(task);

const item = new Schema('items', { idAttribute: item => item.properties._key });
const arrayOfItems = arrayOf(item);

const schemas = {
  task,
  arrayOfTasks,
  item,
  arrayOfItems,
};

export default schemas;
