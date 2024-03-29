import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Shell from './Shell';
import Login from './Login';
import Home from './Home';
import Signup from './Signup';
import DocList from './components/DocList';
import Doc from './components/Doc';
import NewDoc from './components/NewDoc';
import ReportBug from './components/ReportBug';
import TOS from './components/TOS';
import NewGroup from './components/NewGroup';
import GroupList from './components/GroupList';
import Dashboard from './components/Dashboard';
import Splash from './components/Splash';
import WorkshopCalendar from './components/WorkshopCalendar';

let seekingRoute;
function findNext(nextState) {
  seekingRoute = nextState.location.pathname;
}

const routes = [
  <Route path="/login" component={() => (<Login seeking={seekingRoute} />)} />,
  <Route path="/signup" component={Signup} />,
  <Route path="/splash" component={Splash} />,
  <Route path="/tos" component={TOS} />,
  <Route path="/" onEnter={findNext} component={Shell}>
    <Route path="/newdoc" component={NewDoc} />
    <Route path="/mydocs" component={DocList} />
    <Route path="/groups" component={GroupList} />
    <Route path="/newgroup" component={NewGroup} />
    <Route path="/report" component={ReportBug} />
    <Route path="/workshops" component={WorkshopCalendar} />
    <Route path="/doc/:authorId/:docId" component={Doc} />
    <Route path="/dashboard" component={Dashboard} />
    <IndexRoute component={Home} />
  </Route>
];

export default routes;
