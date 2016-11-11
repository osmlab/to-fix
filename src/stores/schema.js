import { Schema, arrayOf } from 'normalizr';

export const task = new Schema('tasks', { idAttribute: 'idtask' });
export const arrayOfTasks = arrayOf(task);

export const item = new Schema('items', { idAttribute: item => item.properties._key });
export const arrayOfItems = arrayOf(item);
