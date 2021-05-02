import  createScriptTag  from '../../lib/html/createScriptTag';
import getClientAssets from '../../lib/file/getClientAssets';

let assets='';
const ifProd = process.env.NODE_ENV === 'development' ? false:true;
export const getHeader = ({

} = {}) => {
    
    assets = getClientAssets('avatar');
    
    let scripts='';
   
  if(!ifProd) {
      
    
    scripts = `${createScriptTag({ src: assets['vendor~main']?.js, dev:true })}${createScriptTag({
        src: assets.main?.js,
        dev:true})}${createScriptTag({ src: assets.runtime?.js, dev:true})}`;
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
  chunkExtractor
} = {}) => {
 
    return `
    </div>

    </body>
   ${chunkExtractor?.getScriptTags({ crossorigin: 'anonymous' })?.replace(/\<script async/g, '<script defer')}
    
    </html>`;
};
