import axios from 'axios';


let baseURL = "http://localhost:3000/api";

const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };

export const instance = axios.create({ baseURL, headers, timeout: 1800000 });

export const generateResourceMethod = (resourceApi, method) => {

  return function(path, data, config = {}) {
  
    let apiCall = resourceApi[method](path, data, config);

    return apiCall.then(
      responseWrapper => {
        let { data } = responseWrapper;
        console.log(data);
        
        return data;
      },
      error => {
        console.log('fail');

        console.log(error);
        throw { data: 'API failed' };
      },
    );
  };
}

export const apiResource = {
  resourceAPI: instance,
  get: generateResourceMethod(instance, 'get'),
  post: generateResourceMethod(instance, 'post')
};