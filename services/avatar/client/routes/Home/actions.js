export function getGitData(obj) {

    return {
      type: "GET_DATA",
      payload: {
        ...obj,
      },
    };
  }
  
  export const updateResults = (obj) => {
    return {
      type: "UPDATE_RESULTS",
      payload: {
        ...obj,
      },
    };
  };
  
  
  export const getDataFromStore = (obj) => {
    return {
      type: "GET_DATA_FROM_STORE",
      payload: {
        ...obj,
      },
    };
  }