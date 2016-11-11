import * as api from '../api';
import * as schema from './schema';
import { asyncAction } from './async';
import TasksConstants from '../constants/tasks_constants';

export const fetchAllTasks = asyncAction({
  type: TasksConstants.TASKS_FETCH_ALL,
  asyncCall: api.tofix.fetchAllTasks,
  responseSchema: { tasks: schema.arrayOfTasks },
});

export const fetchTaskById = asyncAction({
  type: TasksConstants.TASKS_FETCH_BY_ID,
  asyncCall: api.tofix.fetchTaskById,
  responseSchema: schema.task,
});

export const selectTask = ({ idtask }) => ({
  type: TasksConstants.TASKS_SELECT,
  idtask,
});

export const createTask = asyncAction({
  type: TasksConstants.TASKS_CREATE,
  asyncCall: api.tofix.createTask,
  responseSchema: schema.task,
});

export const updateTask = asyncAction({
  type: TasksConstants.TASKS_UPDATE,
  asyncCall: api.tofix.updateTask,
  responseSchema: schema.task,
});

export const destroyTask = asyncAction({
  type: TasksConstants.TASKS_DESTROY,
  asyncCall: api.tofix.destroyTask,
});
