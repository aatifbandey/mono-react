// import config from '@aatif-packages/config';
// import serialize from 'serialize-javascript';
// import jsesc from 'jsesc';

import { ifElse } from '../../lib/logic';


import  createScriptTag  from '../../lib/html/createScriptTag';
import getClientAssets from '../../lib/file/getClientAssets';

const mainBundles =  ['runtime', 'framework~main', 'vendor~main'];
// let assets = getClientAssets('avatar');
let assets=''
export const getHeader = ({

} = {}) => {
    assets = getClientAssets('avatar');
    console.log("Assets", assets);
    let scripts='';
   
        scripts = `${createScriptTag({ src: assets['vendor~main']?.js })}${createScriptTag({
          src: assets.main?.js,
        })}${createScriptTag({ src: assets.runtime?.js })}`;
      
//   let scripts = '';
//   if (!__PROD__) {
//     scripts = `${createScriptTag({ src: assets['vendor~main']?.js })}${createScriptTag({
//       src: assets.main?.js,
//     })}${createScriptTag({ src: assets.runtime?.js })}`;
//   }
  // These are scripts for main bundles
//   const preloadedAssetScripts = mainBundles
//     .map(bundleName => createPreloadTag({ as: 'script', href: get(assets, `[${bundleName}].js`) }))
//     .join('\n\t');
  // ${global.lcpElementUrl ? `<link rel="preload" href='${global.lcpElementUrl}' as="image" crossorigin="anonymous"/>` : ''}
  return `<!DOCTYPE html><html lang="id" ><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=no, width=device-width">
   
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="Tokopedia">
    <meta name="theme-color" content="#42b549">
   
   

    </head>
      ${scripts}
    <div id="root">`;
};
// ${helmet.meta.toString()}${helmet.style.toString()}
export const getFooter = ({
 
} = {}) => {
    assets = getClientAssets('avatar');
  return `
  </div>
    
    
   
   
  </body>
  ${mainBundles.map(b => createScriptTag({ src: assets[b]?.js })).join('')}
</html>`;
};
