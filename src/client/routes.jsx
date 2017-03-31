import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Shell from './Shell';
import Login from './Login';
import Signup from './Signup';
import DocList from './components/DocList';
import Doc from './components/Doc';
import NewDoc from './components/NewDoc';
import NewGroup from './components/NewGroup';

const routes = [
  <Route path="/login" component={Login} />,
  <Route path="/signup" component={Signup} />,
  <Route path="/" component={Shell}>
    <Route path="/newdoc" component={NewDoc} />
    <Route path="/mydocs" component={DocList} />
    <Route path="/newgroup" component={NewGroup} />
    <Route path="/doc/:authorId/:docId" component={Doc} />
  </Route>
];

export default routes;
