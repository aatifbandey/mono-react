import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from "./Home";
import Layout from "../components/Layout";

const Routes = () => {
  const renderedRoutes = (() => {
     
    return (
      <>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
        </Switch>
      </>
    );
  })();
  
  return (
    <Layout>
      {renderedRoutes}
    </Layout>
  );
};
 
  
const RootRoutes = () => <Route component={Routes} />;
  
export default RootRoutes;