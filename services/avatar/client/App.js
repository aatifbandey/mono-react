import React from 'react';
import { Provider } from 'react-redux';

import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './routes';
import { configureStore,  } from '../store';
const { store } = configureStore({});
function App({ history }) {
  return (
    
	<Provider store={store}>
   				<Router history={history}>
        			<Routes />
        		</Router>
	</Provider>
    		
    
  );
}

export default hot(App);