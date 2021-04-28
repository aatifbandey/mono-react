import  createScriptTag  from '../../lib/html/createScriptTag';
import getClientAssets from '../../lib/file/getClientAssets';

const mainBundles =  ['runtime', 'framework~main', 'vendor~main'];
let assets=''
export const getHeader = ({

} = {}) => {
    assets = getClientAssets('avatar');
    
    let scripts='';
   
    scripts = `${createScriptTag({ src: assets['vendor~main']?.js })}${createScriptTag({
        src: assets.main?.js,
    })}${createScriptTag({ src: assets.runtime?.js })}`;
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

export const getFooter = ({
 
} = {}) => {
    assets = getClientAssets('avatar');
    return `
    </div>
    </body>
    ${mainBundles.map(b => createScriptTag({ src: assets[b]?.js })).join('')}
    </html>`;
};
