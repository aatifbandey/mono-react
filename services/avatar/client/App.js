import React from 'react';


import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './routes';


function App({ history }) {
  return (
    
    		
   				<Router history={history}>
        			<Routes />
        		</Router>
    		
    
  );
}

export default App;