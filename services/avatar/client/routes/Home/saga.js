import { takeLatest, call, put } from 'redux-saga/effects'
import { apiResource } from '../../utils/api';
import { updateResults } from "./actions";

function* getData (data) {
  const { payload } = data;
  console.log(payload);
  try {
    const url = `/search`;
    const res = yield call(apiResource.post, url, payload);
    console.log(res);
    if (res && res.data) {
      	yield put(
        updateResults({
          data: res.data?.items,
          type: payload.type,
          search: payload.search
        })
      );
    } 
  } catch(e) {
    updateResults({
        data: [{
            name:"Aatif",
            id: 1
        }],
        type: 'test',
        search: 'test'
      })
  }
}
export default function* homeSaga() {
  yield takeLatest("GET_DATA", getData);
}