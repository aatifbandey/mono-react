import React from 'react';

import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './routes';


function App({ history }) {
  return (
    
    		
   				<Router history={history}>
        			<Routes />
        		</Router>
    		
    
  );
}

export default hot(App);