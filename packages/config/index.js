const { resolve } = require('path');
const appRootDir = require('app-root-dir');
const dotenv = require('dotenv-safe');
const fromPairs = require('lodash/fromPairs');

const { DIR = '', NODE_ENV } = process.env;
console.log(DIR)
const [serviceName] = DIR.split('/');
const baseEnvPath = appRootDir.get().endsWith(serviceName) ? '' : `services/${serviceName}`;

const errorKey = [];

const envConfig = dotenv.config({
  allowEmptyValues: true,
  path: resolve(appRootDir.get(), baseEnvPath, NODE_ENV === 'test' ? '.env.test' : '.env'),
  example: resolve(appRootDir.get(), baseEnvPath, '.env.example'),
});

if (envConfig.error) {
  throw new Error(envConfig.error);
}

const fallbackValue = (key, value) => {
  if (typeof value === 'undefined') {
    errorKey.push({ key, value });

    return '';
  }

  // Array Pattern
  if (/^\[.*/.test(value)) {
    errorKey.push({ key, value });

    return [];
  }

  // Object Pattern
  if (/^{"/.test(value) && /^"}/.test(value)) {
    errorKey.push({ key, value });

    return {};
  }

  return value;
};

const transform = (key, value) => {
  let parsedValue;

  try {
    parsedValue = JSON.parse(value);
  } catch (e) {
    if (typeof value === 'string' && /^true|false$/i.test(value)) {
      parsedValue = Boolean(value);
    } else {
      parsedValue = fallbackValue(key, value);
    }
  }

  return parsedValue;
};

const transformed = Object.keys(envConfig.parsed).reduce((acc, key) => {
  acc[key] = transform(key, envConfig.parsed[key]);

  return acc;
}, {});

const config = {
  get: path => {
    if (typeof transformed[path] === 'undefined') {
      // TODO: check if mutating `transformed` here is necessary and expected. `transformed` is variable used by other methods too. Mutating it causing all methods to be impure and cause testing to be not repeatable.
      transformed[path] = '';
    }
    return transformed[path];
  },

  getObject: () => transformed,

  getError: () => errorKey,

  getConstants: () => {
    const entries = Object.entries(transformed)
      .filter(([key]) => key.startsWith('CONSTANTS_'))
      .map(([key, value]) => {
        const newKey = key.slice(10);
        return [newKey, value];
      });

    const result = fromPairs(entries);
    return result;
  },
};

module.exports = config;
