


const { ifElse } = require('./logic');




const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const ifDev = ifElse(isDev);
const ifProd = ifElse(isProd);



module.exports = {

    
    ifDev,
    ifProd,

    isDev,
    isProd,
    
    
  };
  