import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store';

const store = configureStore(window.APPSTATE);
const history = syncHistoryWithStore(browserHistory, store);

const app = (
  <Provider store={store}>
    <Router routes={routes} history={history} />
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
