import { all, takeEvery, put, call } from 'redux-saga/effects';
import actions from './actions';
import * as dataAccess from '../../../app/utils/ajax';

const getRequest = async (url, payload) =>
	await dataAccess.get(url, payload);

const postRequest = async (url, payload) =>
	await dataAccess.post(url, payload);

// function* getSamples(data) {
// 	const { payload } = data;
// 	let url = GET_USERS;
// 	try {
// 		console.log("Get Users URL: ", url, " \n\n: payload", payload);
// 		let response = yield call(getRequest, url, payload);
// 		console.log('Get Users Response', response);
// 		response = dataAccess.parsePayload(response);
// 		if (0 === response.statusCode) {
// 			yield put(actions.getUsersSuccess(response.statusCode, response.response));
// 		} else {
// 			debugger;
// 			yield put(actions.getUsersError(response.statusCode, response.errMessage));
// 		}
// 	} catch (error) {
// 		yield put(actions.getUsersError(1));
// 	}
// }



export default function* rootSaga() {
	yield all(
		[
			// takeEvery(actions.GET_SAMPLES, getSamples),
			
		]);
}