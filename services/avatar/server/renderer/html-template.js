// import config from '@aatif-packages/config';
// import serialize from 'serialize-javascript';
// import jsesc from 'jsesc';

import { ifElse } from '../../lib/logic';




const ifProd = ifElse(__PROD__);

export const getHeader = ({
  
} = {}) => {

//   let scripts = '';
//   if (!__PROD__) {
//     scripts = `${createScriptTag({ src: assets['vendor~main']?.js })}${createScriptTag({
//       src: assets.main?.js,
//     })}${createScriptTag({ src: assets.runtime?.js })}`;
//   }
  // These are scripts for main bundles
  // const preloadedAssetScripts = mainBundles
  //   .map(bundleName => createPreloadTag({ as: 'script', href: get(assets, `[${bundleName}].js`) }))
  //   .join('\n\t');
  // ${global.lcpElementUrl ? `<link rel="preload" href='${global.lcpElementUrl}' as="image" crossorigin="anonymous"/>` : ''}
  return `<!DOCTYPE html><html lang="id" ><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=no, width=device-width">
   
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="Tokopedia">
    <meta name="theme-color" content="#42b549">
   
   

    </head>
    <div id="content">`;
};
// ${helmet.meta.toString()}${helmet.style.toString()}
export const getFooter = ({
 
} = {}) => {
  
  return `
  </div>
    <div id="modal"></div>
    
    </script>
   
  </body>
</html>`;
};
