import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Shell from './Shell';
import Login from './Login';
import Redirect from './Redirect';
import AdminApp from './apps/admin/AdminApp';
import PartnerApp from './apps/partner/PartnerApp';
import PublisherApp from './apps/publisher/PublisherApp';
import authorize, { requireRole } from './util/authorize';

const routes = [
  <Route path="login" component={Login} />,
  <Route path="/" component={Shell}>
    <Route path="admin/:userid" component={authorize(AdminApp, requireRole('admin'))} />
    <Route path="partner/:userid" component={authorize(PartnerApp, requireRole('partner'))} />
    <Route path="publisher/:userid" component={authorize(PublisherApp, requireRole('publisher'))} />
    <IndexRoute component={Redirect} />
  </Route>
];

export default routes;
