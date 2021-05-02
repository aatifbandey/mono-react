import React from 'react';
import { Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component'


const Home = loadable(
  () => import(/* webpackChunkName: "home" */ '@routes/Home/'),
  {
    fallback: '<div> Loading chunk ....</div>',
    ssr: true,
  },
);

const About = loadable(
  () => import(/* webpackChunkName: "about" */ '@routes/About/'),
  {
    fallback: '<div> Loading chunk ....</div>',
    ssr: true,
  },
);


import Layout from "../components/Layout";

const Routes = () => {
  const renderedRoutes = (() => {
     
    return (
      <>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/about-us" exact>
            <About />
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