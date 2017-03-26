import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import createLogger from 'redux-logger';
import persistState from 'redux-localstorage';
import thunkMiddleware from 'redux-thunk';
import * as reducers from '../reducers';

export default function configureStore(initialState) {
  const store = createStore(
    combineReducers({
      ...reducers,
      routing: routerReducer
    }),
    initialState,
    compose(
      applyMiddleware(
        createLogger(),
        routerMiddleware(browserHistory),
        thunkMiddleware
      ),
      persistState('auth')
    )
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const newRootReducer = require('../reducers').default; // eslint-disable-line global-require
      store.replaceReducer(newRootReducer);
    });
  }

  return store;
}
