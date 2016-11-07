import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import App from './components/app';
import Task from './components/task';
import Stats from './components/stats';
import Admin from './components/admin';
import Activity from './components/activity';

const defaultTask = 'overlappingminorhighwaysrjogv';

export default (
  <Route path='/' component={App}>
    <IndexRedirect to={`/task/${defaultTask}`} />
    <Route name='task' path='/task/:task' component={Task} />
    <Route name='activity' path='/activity/:task' component={Activity} />
    <Route name='stats' path='/stats/:task' component={Stats} />
    <Route name='admin' path='/admin/:task' component={Admin} />
  </Route>
);
