/* eslint-disable  */
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createEpicMiddleware } from 'redux-observable';
import thunkMiddleware from 'redux-thunk';
// import { fromJS } from 'immutable';

import rootReducer from '../client/reducers';
import rootEpic from '../client/epics'
import middlewares from '../client/middleware';

/**
 * [Initiates the global redux store. Combines the initial state
 * with the history object to return a new redux store]
 * @param  {Object} [req]             [request object received by express server from the client]
 * @param  {Object} [initialState={}] [initial state for the app]
 * @return {[type]}                   [an instance of the redux store]
 */
export default (req, initialState = {}, history) => {

  const appRouterMiddleware = routerMiddleware(history);
  const epicMiddleware = createEpicMiddleware();

  const composeEnhancers = compose;

  const store = createStore(
    rootReducer, // Root reducer
    initialState, // Initial state
    composeEnhancers(
      applyMiddleware(
        thunkMiddleware,
        appRouterMiddleware,
        ...middlewares,
        epicMiddleware,
      )
    )
  )
  epicMiddleware.run(rootEpic);
  return store;
};
