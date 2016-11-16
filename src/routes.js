import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import App from './components/app';
import Task from './components/task';
import Stats from './components/stats';
import Admin from './components/admin';
import Activity from './components/activity';

import store from './stores/store';
import TasksActionCreators from './stores/tasks_action_creators';

import { DEFAULT_TASK_ID } from './config';

const onEnter = (nextState) => {
  const nextTaskId = nextState.params.task || DEFAULT_TASK_ID;
  store.dispatch(TasksActionCreators.selectTask({ idtask: nextTaskId }));
};

const onChange = (prevState, nextState) => {
  const prevTaskId = prevState.params.task;
  const nextTaskId = nextState.params.task;

  if (prevTaskId !== nextTaskId) {
    store.dispatch(TasksActionCreators.selectTask({ idtask: nextTaskId }));
  }
};

export default (
  <Route path='/' component={App} onEnter={onEnter} onChange={onChange}>
    <IndexRedirect to={`/task/${DEFAULT_TASK_ID}`} />
    <Route name='task' path='/task/:task' component={Task} />
    <Route name='activity' path='/activity/:task' component={Activity} />
    <Route name='stats' path='/stats/:task' component={Stats} />
    <Route name='admin' path='/admin/:task' component={Admin} />
  </Route>
);
