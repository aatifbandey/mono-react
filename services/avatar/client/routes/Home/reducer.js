// import { cloneDeep } from "lodash";


// The initial state of the App
export const initialState = {
  data: {},
  type: 'user',
  apiCall: false,
  search: null,
};

export const homeReducer = (state = initialState, action) => {
  switch (action.type) {
  case "UPDATE_RESULTS":
    // const tempData = cloneDeep(state.data);
    // tempData[`${action.payload.search}_${action.payload.type}`] = action.payload.data;
    return {
      data: tempData,
      search: action.payload.search,
      type: action.payload.type,
      apiCall: true
    };
  case "GET_DATA_FROM_STORE":
   
    return {
      ...state,
      search: action.payload.search,
      type: action.payload.type
    };
  default:
    return state;
  }
};