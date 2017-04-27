import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Shell from './Shell';
import Login from './Login';
import Home from './Home';
import Signup from './Signup';
import DocList from './components/DocList';
import Doc from './components/Doc';
import NewDoc from './components/NewDoc';
import NewGroup from './components/NewGroup';
import GroupList from './components/GroupList';
import Dashboard from './components/Dashboard';
import WorkshopCalendar from './components/WorkshopCalendar';

let seekingRoute;
function findNext(nextState) {
  seekingRoute = nextState.location.pathname;
}

const routes = [
  <Route path="/login" component={() => (<Login seeking={seekingRoute} />)} />,
  <Route path="/signup" component={Signup} />,
  <Route path="/" onEnter={findNext} component={Shell}>
    <Route path="/newdoc" component={NewDoc} />
    <Route path="/mydocs" component={DocList} />
    <Route path="/groups" component={GroupList} />
    <Route path="/newgroup" component={NewGroup} />
    <Route path="/workshops" component={WorkshopCalendar} />
    <Route path="/doc/:authorId/:docId" component={Doc} />
    <IndexRoute component={Home} />
  </Route>
];

export default routes;
