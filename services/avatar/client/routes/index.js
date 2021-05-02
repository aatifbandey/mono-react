import React from 'react';
import { Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component'


const Home = loadable(
  () => import(/* webpackChunkName: "home" */ './Home/'),
  {
    fallback: '<div> Loading chunk ....</div>',
    ssr: true,
  },
);

const About = loadable(
  () => import(/* webpackChunkName: "about" */ './About/'),
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
        <Route path="/" exact component={props => <Home {...props} />} />
        <Route path="/about-us" exact component={props => <About {...props} />} />

         
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