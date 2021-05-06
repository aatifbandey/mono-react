import React, { useEffect } from 'react';
import { ReactReduxContext } from 'react-redux';

import { getInjectors } from './sagaInjector';

/**
 * Dynamically injects a saga, passes component's props as saga arguments
 */

const useInjectSaga = ({ key, saga, mode }) => {
  const context = React.useContext(ReactReduxContext);
  /* eslint-disable */
  useEffect(() => {
    const injectors = getInjectors(context.store);

    injectors.injectSaga(key, { saga, mode });

    return () => {
      injectors.ejectSaga(key);
    };
  }, []);
  /* eslint-enable */
};

export { useInjectSaga };