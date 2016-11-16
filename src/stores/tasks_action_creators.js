import api from '../api';
import schemas from './schemas';
import { asyncAction } from './async_action';
import TasksConstants from '../constants/tasks_constants';

const TasksActionCreators = {
  fetchAllTasks: asyncAction({
    type: TasksConstants.TASKS_FETCH_ALL,
    asyncCall: api.tofix.fetchAllTasks,
    responseSchema: { tasks: schemas.arrayOfTasks },
    showLoader: true,
  }),

  fetchTaskById: asyncAction({
    type: TasksConstants.TASKS_FETCH_BY_ID,
    asyncCall: api.tofix.fetchTaskById,
    responseSchema: schemas.task,
  }),

  selectTask: ({ idtask }) => ({
    type: TasksConstants.TASKS_SELECT,
    idtask,
  }),

  createTask: asyncAction({
    type: TasksConstants.TASKS_CREATE,
    asyncCall: api.tofix.createTask,
    responseSchema: schemas.task,
    showLoader: true,
  }),

  updateTask: asyncAction({
    type: TasksConstants.TASKS_UPDATE,
    asyncCall: api.tofix.updateTask,
    responseSchema: schemas.task,
    showLoader: true,
  }),

  destroyTask: asyncAction({
    type: TasksConstants.TASKS_DESTROY,
    asyncCall: api.tofix.destroyTask,
    showLoader: true,
  }),
};

export default TasksActionCreators;
