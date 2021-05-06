import { conformsTo, isFunction, isObject } from 'lodash';

/**
 * Validate the shape of redux store
 */
export const checkStore = (store) => {
  const shape = {
    dispatch: isFunction,
    subscribe: isFunction,
    getState: isFunction,
    replaceReducer: isFunction,
    runSaga: isFunction,
    injectedReducers: isObject,
    injectedSagas: isObject,
  };

  console.log(
    conformsTo(store, shape),
    '(app/utils...) injectors: Expected a valid redux store',
  );
}