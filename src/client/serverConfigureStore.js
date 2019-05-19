/* eslint-disable  */
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createEpicMiddleware } from 'redux-observable';
// import { fromJS } from 'immutable';

import rootReducer from './reducers';
import rootEpic from './epics'
import middlewares from './middleware';

/**
 * [Initiates the global redux store. Combines the initial state
 * with the history object to return a new redux store]
 * @param  {Object} [req]             [request object received by express server from the client]
 * @param  {Object} [initialState={}] [initial state for the app]
 * @return {[type]}                   [an instance of the redux store]
 */
export default (req, initialState = {}) => {
  // No appRouterMiddleware on server.
  // const appRouterMiddleware = routerMiddleware(history);
  const epicMiddleware = createEpicMiddleware();
  
  // window object is undefined on server.
  // So `const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;`
  // will not work.
  const composeEnhancers = compose;

  const store = createStore(
    rootReducer, // Root reducer
    initialState, // Initial state
    composeEnhancers(
      applyMiddleware(
        // appRouterMiddleware,        
        ...middlewares,
        epicMiddleware,
      )  
    )
  )
  epicMiddleware.run(rootEpic);
  return store;
};
