import  createScriptTag  from '../../lib/html/createScriptTag';
import getClientAssets from '../../lib/file/getClientAssets';

let assets='';
const ifProd = process.env.NODE_ENV === 'production' ? true:false;
const mainBundles= ['runtime', 'framework~main', 'vendor~main', 'main'];

export const getHeader = ({
  ssr=false
} = {}) => {
    
    assets = getClientAssets('avatar');
    
    let scripts='';
   
  if(!ifProd && !ssr) {
      
    
    scripts = `${createScriptTag({ src: assets['vendor~main']?.js })}${createScriptTag({
        src: assets.main?.js})}${createScriptTag({ src: assets.runtime?.js})}`;
  }
  return `<!DOCTYPE html><html lang="id" ><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=no, width=device-width">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="Aatif Bandey">
    <meta name="theme-color" content="#42b549">
    </head>
      ${scripts}
    <div id="root">`;
};

export const getFooter = ({
  chunkExtractor,
  ssr
} = {}) => {
  console.log(mainBundles);
    return `
    </div>

    </body>
   ${chunkExtractor?.getScriptTags({ crossorigin: 'anonymous' })?.replace(/\<script async/g, '<script defer')  ||
   mainBundles.map(b => createScriptTag({ src: assets[b]?.js, dev:ssr?true:false })).join('')}
    
    </html>`;
};
