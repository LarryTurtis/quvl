import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Shell from './Shell';
import Login from './Login';
import Main from './Main';
import authorize, { requireRole } from './util/authorize';

const routes = [
  <Route path="login" component={Login} />,
  <Route path="/" component={Shell}>
    <IndexRoute component={Main} />
  </Route>
];

export default routes;
