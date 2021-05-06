import React from 'react';

import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server'

import App from '../../client/routes';
import { getHeader, getFooter } from './html-template';
import { ChunkExtractor } from '@loadable/server';
import path from 'path';
import { Provider  } from "react-redux";
import { configureStore  } from '../../store';
const debug = require('debug')('avatar:render');

const statsFile = path.resolve(__dirname, '../../build/client/loadable-stats.json');

const renderer = async ctx => {
  debug(`server side render ${ctx.url}`);
  

  const hydrateOnClient = (status = 200) => {
    const htmlStates = {
      initState: {},
    };

    ctx.status = status;
    global.status = status;
    ctx.body = `${getHeader()}${getFooter(htmlStates)}`;
  
  };
  let completeHtmlDoc = '';
  const routerContext = { status: 200, matchedModule: ''};
  try {
    
    const chunkExtractor = new ChunkExtractor({ statsFile });
    
    
    const { store } = configureStore({});
    const app = chunkExtractor.collectChunks(
      <Provider store={store}>
        <StaticRouter location={ctx.url} context={routerContext}>
          <App />
        </StaticRouter>
      </Provider>
    );
   
    ctx.routerContext = routerContext;
    const body = await renderToString(app);

    // const body = await renderToString(<StaticRouter location={ctx.url} context={routerContext}>
    //     <App />
    // </StaticRouter>);
    
    let htmlStates = {
      ...htmlStates,
      chunkExtractor,
      ssr: true
    };
    completeHtmlDoc += getHeader(htmlStates);


    if (routerContext.url) {
      
      ctx.status = routerContext?.location?.state?.status || 302;
      ctx.set('Location', routerContext.url);
      ctx.redirect(routerContext.url);

      return;
    }
    completeHtmlDoc += body;
    // Otherwise everything is all good and we send a 200 OK status.

    // htmlStates = {
    //   ...htmlStates,
    //   chunkExtractor,
    //   // bundles: getBundles(stats, modules),
    // };
    // #checkpoint: 'HTML_STATE_EXTRACTED',
   
    completeHtmlDoc += getFooter(htmlStates);
    
    ctx.body = completeHtmlDoc;
    
    return;
  } catch (e) {
 
    console.log("Testing", e);
    hydrateOnClient();
  }
};

export default renderer;
