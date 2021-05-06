import { routerReducer } from 'react-router-redux';

import { combineReducers } from 'redux';
import { homeReducer } from '../client/routes/Home/reducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer() {
  const rootReducer = combineReducers({
    homeReducer,
    routing: routerReducer
  });

  return rootReducer;
}