import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware, routerReducer } from 'react-router-redux';
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
      persistState('auth'),
      applyMiddleware(
        routerMiddleware(browserHistory),
        thunkMiddleware
      )
    )
  );

  return store;
}
