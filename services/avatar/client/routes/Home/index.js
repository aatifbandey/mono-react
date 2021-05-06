import React from "react";

import { useDispatch, useSelector } from 'react-redux';
import { useInjectSaga } from '../../../saga/injectSaga';

import homeSaga from './saga';

const Home = () => {
  console.log("Test...", useInjectSaga);
  useInjectSaga({ key: 'homeSaga', saga: homeSaga });
  const dispatch = useDispatch();
	
  const reducerState = useSelector((state)=> state.homeReducer);
  console.log(reducerState);
  const testFn = () =>{
    console.log("Hello world")
  } 
  return  (
    <div>
      <div> Check out the payground for mono-repo, article coming soon</div>
      <input type="text" onClick={testFn}/>
    </div>
  );
  
}

export default Home;
