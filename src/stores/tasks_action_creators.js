import { server } from '../services';
import schemas from './schemas';
import { asyncAction } from './async_action';
import TasksConstants from '../constants/tasks_constants';

const TasksActionCreators = {
  fetchAllTasks: asyncAction({
    type: TasksConstants.TASKS_FETCH_ALL,
    asyncCall: server.fetchAllTasks,
    responseSchema: { tasks: schemas.arrayOfTasks },
    showLoader: true,
  }),

  fetchTaskById: asyncAction({
    type: TasksConstants.TASKS_FETCH_BY_ID,
    asyncCall: server.fetchTaskById,
    responseSchema: schemas.task,
  }),

  selectTask: ({ idtask }) => ({
    type: TasksConstants.TASKS_SELECT,
    idtask,
  }),

  createTask: asyncAction({
    type: TasksConstants.TASKS_CREATE,
    asyncCall: server.createTask,
    responseSchema: schemas.task,
    showLoader: true,
  }),

  updateTask: asyncAction({
    type: TasksConstants.TASKS_UPDATE,
    asyncCall: server.updateTask,
    responseSchema: schemas.task,
    showLoader: true,
  }),

  destroyTask: asyncAction({
    type: TasksConstants.TASKS_DESTROY,
    asyncCall: server.destroyTask,
    showLoader: true,
  }),
};

export default TasksActionCreators;
